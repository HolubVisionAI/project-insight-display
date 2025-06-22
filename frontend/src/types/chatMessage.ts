export interface Message {
    id: number;
    message: string;
    session_id: string;
    sender: "user" | "bot";
    timestamp: string;
}

export interface ChatHistory {
  session_id: string;
  messages: Message[];
}