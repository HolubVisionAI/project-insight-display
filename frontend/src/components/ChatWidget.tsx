import {useState, useEffect, useRef} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {useChat} from "@/hooks/useChat";

import {MessageSquare, X, Send, User, Bot, Loader2} from "lucide-react";

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {messages, isLoading, error, sendMessage} = useChat();
    const [newMessage, setNewMessage] = useState("");
    console.log(isLoading);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages, isLoading]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        sendMessage(newMessage.trim());
        setNewMessage("");
    };

    return (
        <>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-6 z-50 rounded-full w-14 h-14 shadow-lg hover:scale-105 transition-transform"
                size="icon"
            >
                {isOpen ? <X size={24}/> : <MessageSquare size={24}/>}
            </Button>

            {isOpen && (
                <Card className="fixed bottom-36 right-6 z-40 w-80 h-96 shadow-2xl animate-scale-in">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                            <MessageSquare size={18} className="mr-2"/> Chat Assistant
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex flex-col h-full">
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${
                                        message.sender === "user" ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg ${
                                            message.sender === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        <div className="flex items-start space-x-2">
                                            {message.sender === "user" ? <User size={14}/> : <Bot size={14}/>}
                                            <div>
                                                <p className="text-sm">{message.message}</p>
                                                <p className="text-xs opacity-70 mt-1">
                                                    {new Date(message.timestamp).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Loading indicator for bot */}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div
                                        className="max-w-[80%] p-3 rounded-lg bg-muted text-muted-foreground flex items-center space-x-2">
                                        <Loader2 className="animate-spin h-4 w-4"/>
                                        <span className="text-sm">Bot is typing...</span>
                                    </div>
                                </div>
                            )}

                            <div ref={endOfMessagesRef}/>
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="border-t border-border p-4">
                            <div className="flex space-x-2">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1"
                                />
                                <Button type="submit" size="icon">
                                    <Send size={16}/>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </>
    );
};

export default ChatWidget;
