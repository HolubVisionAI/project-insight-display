// src/components/CommentSection.tsx
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {AlertTriangle, MessageSquare, User} from "lucide-react";
import {useComments} from "@/hooks/useComments";
import type {Comment} from "@/types/comments"
import {useAuth} from "@/hooks/useAuth";
import {Navigate, useLocation} from "react-router-dom";
import {useToast} from "@/hooks/use-toast";

interface CommentSectionProps {
    projectId: number;
}

export default function CommentSection({projectId}: CommentSectionProps) {

    const {comments, loading, error, addComment} = useComments(projectId);
    const [newContent, setNewContent] = useState("");
    const [authorName, setAuthorName] = useState("");
    const {user} = useAuth();
    const {toast} = useToast();
    // If not logged in, redirect to login,
    // preserving where we came from in state so you can send them back:
    // console.log(comments);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!authorName.trim() || !newContent.trim()) return;
        try {
            if (user) {
                await addComment(authorName, newContent);
                setAuthorName("");
                setNewContent("");
            } else {
                toast({
                    title: "Alert",
                    description: "After login, you can write comment",
                    variant: "destructive",
                    duration: 2000
                });
                return;
            }

        } catch {
            // (error is already set in the hook)
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <MessageSquare size={20} className="mr-2"/>
                    Comments ({comments.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* New comment form */}
                <form onSubmit={handleSubmit} className="mb-8 space-y-4">
                    <div>
                        <Label htmlFor="author">Name</Label>
                        <Input
                            id="author"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <Label htmlFor="content">Comment</Label>
                        <Textarea
                            id="content"
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            placeholder="What do you think?"
                            rows={4}
                        />
                    </div>
                    <Button type="submit" disabled={!authorName || !newContent}>
                        Post Comment
                    </Button>
                </form>

                {/* Loading / error */}
                {loading && <p>Loading comments…</p>}
                {error && <p className="text-red-600">Error: {error.message}</p>}

                {/* Comment list */}
                <div className="space-y-6">
                    {!loading && comments.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No comments yet. Be the first to comment!
                        </div>
                    )}

                    {comments.map((c: Comment) => (
                        <div key={c.id} className="border-b border-border pb-6 last:border-b-0">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                                        <User size={16} className="text-muted-foreground"/>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <h4 className="font-semibold text-foreground">{c.authorName}</h4>
                                        <span className="text-sm text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                                    </div>
                                    <p className="text-muted-foreground">{c.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
