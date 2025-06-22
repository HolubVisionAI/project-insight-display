# src/routes/chat.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import os
from huggingface_hub import InferenceClient
from fastapi.concurrency import run_in_threadpool

from ..db import models, schemas
from ..db.database import get_db, SessionLocal

router = APIRouter(prefix="/api/v1/chat", tags=["chat"])

# — load HF client once —
HF_TOKEN = os.getenv("HF_API_TOKEN")
HF_MODEL = os.getenv("HF_MODEL")
if not HF_TOKEN:
    raise RuntimeError("HF_API_TOKEN environment variable is required")
hf_client = InferenceClient(api_key=HF_TOKEN)


async def get_rule_based_response(
        session_id: int,
        message: str,
        db: Session
) -> str:
    # 1) Load prior messages
    # db_msgs = (
    #     db.query(models.ChatMessage)
    #       .filter_by(session_id=str(session_id))
    #       .order_by(models.ChatMessage.timestamp.asc())
    #       .all()
    # )
    #
    # # 2) Build HF‐style history, using only plain strings
    # history = [
    #     {"role": "system", "content": "You are a helpful assistant."}
    # ]
    # for m in db_msgs:
    #     history.append({
    #         "role": m.sender.value,   # <-- enum → str
    #         "content": m.message
    #     })
    # # add the new user turn
    # history.append({"role": "user", "content": message})
    #
    # for m in db_msgs:
    #     history.append({
    #         "role": m.sender.value,  # user or bot
    #         "content": m.message
    #     })

    # 3) Call the model
    result = await run_in_threadpool(
        hf_client.chat_completion,
        [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": message}
        ],
        model=HF_MODEL,
        max_tokens=150,
    )
    # result = hf_client.chat_completion(
    #     [
    #         {"role": "system", "content": "You are a helpful assistant."},
    #         {"role": "user", "content": message}
    #     ],
    #     model="mistralai/Mistral-7B-Instruct-v0.3",
    #     max_tokens=50
    # )
    return result.choices[0].message.content


@router.post("", response_model=schemas.ChatMessageOut)
async def chat_message(
        payload: schemas.ChatMessageIn,
        db: Session = Depends(get_db),
):
    """
    Send a single message via REST.
    If no session_id is provided, create a new ChatSession.
    """
    # 1) Ensure or create session
    if payload.session_id:
        session = db.query(models.ChatSession).get(payload.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        session = models.ChatSession(created_at=datetime.now())
        db.add(session)
        db.commit()
        db.refresh(session)

    # 2) Persist user message
    user_msg = models.ChatMessage(
        session_id=session.id,
        sender="user",
        message=payload.message,
        timestamp=datetime.now(),
    )
    db.add(user_msg)

    # 3) Generate & persist bot reply
    reply_text = await get_rule_based_response(session.id, payload.message, db)
    bot_msg = models.ChatMessage(
        session_id=session.id,
        sender="bot",
        message=reply_text,
        timestamp=datetime.now(),
    )
    db.add(bot_msg)
    db.commit()

    return bot_msg


@router.get(
    "/history",
    response_model=schemas.ChatHistoryOut,
    summary="Fetch or create a chat session and its full history"
)
def get_history(
        session_id: Optional[str] = Query(
            None,
            description="Existing session to load; omit to start a new one"
        ),
        db: Session = Depends(get_db),
):
    """
    If `session_id` is provided, return that session's messages (oldest first).
    Otherwise create a new session and return it with an empty message list.
    """
    if session_id:
        # load existing session
        session = db.get(models.ChatSession, session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        msgs = (
            db.query(models.ChatMessage)
            .filter_by(session_id=session.id)
            .order_by(models.ChatMessage.timestamp.asc())
            .all()
        )
    else:
        # create brand‐new session
        session = models.ChatSession()
        db.add(session)
        db.commit()
        db.refresh(session)
        msgs = []

    # return both the session_id and the list of messages
    return schemas.ChatHistoryOut(
        session_id=str(session.id),
        messages=msgs
    )
