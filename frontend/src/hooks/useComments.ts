import { useState, useEffect, useCallback } from "react";
import type { Comment } from "@/types/comments"
import { listCommentsApi, createCommentApi } from "@/api/comments";

export function useComments(projectId: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCommentsApi(projectId);
      setComments(data);
    } catch (err: any) {
        setError(err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const addComment = useCallback(
    async (authorName: string, content: string) => {
      try {
        const newComment = await createCommentApi(projectId, authorName, content);
        setComments((prev) => [newComment, ...prev]);
        return newComment;
      } catch (err: any) {
        setError(err);
        throw err;
      }
    },
    [projectId]
  );

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, loading, error, addComment };
}
