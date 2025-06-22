// src/hooks/useChat.ts
import {useState, useEffect, useCallback} from "react";
import {getChatHistoryApi, postChatMessageApi} from "@/api/chat";
import type {Message} from "@/types/chatMessage";

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 1) load (or create) session + history
    useEffect(() => {
        let canceled = false;
        getChatHistoryApi()
            .then(({session_id, messages}) => {
                if (canceled) return;
                setSessionId(session_id);
                // assume messages[].timestamp is ISO‐string
                setMessages(
                    messages.map(m => ({
                        ...m,
                        timestamp: new Date(m.timestamp).toISOString(),
                    }))
                );
            })
            .catch(err => {
                if (!canceled) setError(err.message);
            })
            .finally(() => {
                if (!canceled) setIsLoading(false);
            });
        return () => {
            canceled = true;
        };
    }, []);

    // 2) send message + get bot reply
    const sendMessage = useCallback(

        async (text: string) => {
            setIsLoading(true);
            // show user msg immediately
            const userMsg: Message = {
                id: Date.now(),
                session_id: sessionId ?? "",
                sender: "user",
                message: text,
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, userMsg]);

            try {
                const botMsg = await postChatMessageApi(text, sessionId ?? undefined);
                // capture sessionId on first reply
                if (!sessionId) {
                    setSessionId(botMsg.session_id);
                }
                // append bot
                setMessages((prev) => [...prev, botMsg]);
                setIsLoading(false);
            } catch (err: any) {
                setError(err.message || "Failed to send");
            }
        },
        [sessionId]
    );

    return {messages, isLoading, error, sendMessage};
}
