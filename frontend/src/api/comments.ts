// src/api/comments
import type {Comment} from "@/types/comments";

const BASE = "/api/v1/projects";

export async function listCommentsApi(projectId: number): Promise<Comment[]> {
    const res = await fetch(`${BASE}/${projectId}/comments`);
    if (!res.ok) {
        throw new Error(`Error fetching comments: ${res.statusText}`);
    }
    const data = (await res.json()) as Array<{
        id: number;
        author_name: string;
        content: string;
        created_at: string;
    }>;

    // 2) map each item into your Comment interface
    return data.map(item => ({
        id: item.id,
        authorName: item.author_name,
        content: item.content,
        createdAt: item.created_at,
    }));
}

export async function createCommentApi(
    projectId: number,
    authorName: string,
    content: string
): Promise<Comment> {
    const res = await fetch(`${BASE}/${projectId}/comments`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({author_name: authorName, content}),
    });
    if (!res.ok) {
        throw new Error(`Error posting comment: ${res.statusText}`);
    }
    return res.json();
}
