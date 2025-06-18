// src/types/comment.ts
export interface Comment {
    /** The database PK */
    id: number;
    /** The person who posted */
    authorName: string;
    /** The comment body */
    content: string;
    /** ISO-8601 timestamp of when it was created */
    createdAt: string;
}
