# signaling_server.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware


class InviteState(BaseModel):
    invite_link: Optional[str] = None
    guest_count: int = 0
    expected_guests: int = 0
    share_link: Optional[str] = None


router = APIRouter(prefix="/api/v1/signalling", tags=["singaling"])
# global state
state = InviteState()


@router.post("/invite")
async def set_invite(payload: InviteState):
    """
    Host calls this once it has the invite link.
    Resets guest_count to 0.
    """
    state.invite_link = payload.invite_link
    state.expected_guests = payload.expected_guests
    state.guest_count = 0
    return {"status": "invite registered"}


@router.get("/invite")
async def get_invite():
    """
    Guests poll this until state.invite_link is set.
    """
    return {"invite_link": state.invite_link}


@router.get("/share_link")
async def get_invite():
    """
    human poll this until state.invite_link is set.
    """
    return {"invite_link": state.share_link}


@router.get("/guest_count")
async def get_guest_count():
    """
    Host polls this to see how many guests have joined.
    """
    return {
        "guest_count": state.guest_count,
        "expected_guests": state.expected_guests,
    }


@router.post("/share_link")
async def set_share_link():
    """
    Host calls this once it has the share link.
    """
    if state.invite_link is None:
        raise HTTPException(400, "Invite link must be set before share link")
    state.share_link = state.invite_link
    return {"status": "share link registered"}


@router.post("/guest_join")
async def guest_join():
    """
    Each Guest calls this once it has successfully joined the room.
    """
    if state.guest_count < state.expected_guests:
        state.guest_count += 1
        return {"guest_count": state.guest_count}
    else:
        # defensive
        raise HTTPException(400, "All guests already joined")


@router.get("/clear")
async def clear_state():
    """
    Reset the invite link, guest count, and expected guests back to defaults.
    """
    state.invite_link = None
    state.guest_count = 0
    state.expected_guests = 0
    state.share_link = None
    return {"status": "state cleared"}
