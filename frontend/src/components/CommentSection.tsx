
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, User } from "lucide-react";

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  avatar?: string;
}

interface CommentSectionProps {
  projectId: number;
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: 1,
    author: "John Developer",
    content: "Amazing work! The UI is so clean and the functionality is impressive. Would love to see the source code for the authentication system.",
    createdAt: "2024-01-20",
  },
  {
    id: 2,
    author: "Sarah Designer",
    content: "The design is beautiful! Great use of colors and typography. The user experience feels very intuitive.",
    createdAt: "2024-01-18",
  },
];

const CommentSection = ({ projectId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      author: authorName,
      content: newComment,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setComments([comment, ...comments]);
    setNewComment("");
    setAuthorName("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare size={20} className="mr-2" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-8 space-y-4">
          <div>
            <Label htmlFor="author">Name</Label>
            <Input
              id="author"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this project..."
              rows={4}
              required
            />
          </div>
          <Button type="submit">Post Comment</Button>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-border pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <User size={16} className="text-muted-foreground" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-foreground">{comment.author}</h4>
                    <span className="text-sm text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentSection;
