from fastapi import APIRouter, Depends, WebSocket
from sqlalchemy.orm import Session
import json
from ..db import models, schemas
from ..db.database import get_db

router = APIRouter(prefix="/api/v1/chat", tags=["chat"])


def get_rule_based_response(message: str) -> str:
    """Simple rule-based chatbot response."""
    message = message.lower()
    if "hello" in message or "hi" in message:
        return "Hello! How can I help you today?"
    elif "project" in message:
        return "I can help you find projects. What kind of project are you looking for?"
    elif "contact" in message:
        return "You can reach us through the contact form or email."
    else:
        return "I'm not sure I understand. Could you please rephrase your question?"


@router.post("", response_model=schemas.ChatResponse)
def chat_message(
        message: schemas.ChatMessage,
        db: Session = Depends(get_db)
):
    # Store user message
    db_message = models.ChatMessage(
        session_id=message.session_id,
        sender="user",
        message=message.message
    )
    db.add(db_message)

    # Generate and store bot response
    response = get_rule_based_response(message.message)
    db_response = models.ChatMessage(
        session_id=message.session_id,
        sender="bot",
        message=response
    )
    db.add(db_response)

    db.commit()
    return schemas.ChatResponse(session_id=message.session_id, reply=response)


@router.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)

            if message_data["event"] == "message":
                response = get_rule_based_response(message_data["data"]["message"])
                await websocket.send_json({
                    "event": "reply",
                    "data": {"reply": response}
                })
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()
