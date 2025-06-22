// src/api/chat.ts
import {Message, ChatHistory} from "@/types/chatMessage.ts"

const BASE = `${import.meta.env.VITE_API_URL}/api/v1/chat`;


export async function getChatHistoryApi(
    sessionId?: string
): Promise<ChatHistory> {
    // build URL with optional query‐param
    let url = `${BASE}/history`;
    if (sessionId) {
        url += `?session_id=${encodeURIComponent(sessionId)}`;
    }

    const res = await fetch(url);
    if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.detail || "Could not load chat history");
    }

    // returns { session_id: string, messages: Message[] }
    return res.json();
}

export async function postChatMessageApi(
    text: string,
    sessionId?: string
): Promise<Message> {
    const body: Record<string, any> = {text};
    if (sessionId) {
        body.session_id = sessionId;
    }
    const res = await fetch(`${BASE}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Chat API error");
    }
    return res.json();
}
