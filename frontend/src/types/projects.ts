// src/types/projects.ts

/**
 * The shape of a Project as returned by the API.
 * Field names are in camelCase to match your front-end convention.
 */
export interface Project {
    id: number;
    title: string;
    shortDesc: string;
    detailDesc: string;
    thumbnail?: string;
    demoUrl?: string;
    githubUrl?: string;
    techTags: string[];
    viewCount: number;      // if your backend returns this
    comments: number;       // likewise
    createdAt: string;      // ISO date
    updatedAt: string;      // ISO date
}

/**
 * Payload for creating a new project.
 * All _required_ up-front fields are non-nullable.
 */
export interface ProjectCreate {
    title: string;
    shortDesc: string;
    thumbnail?: string;
    demoUrl?: string;
    githubUrl?: string;
    techTags: string[];
}

/**
 * Payload for updating an existing project.
 * All fields are optional, since you only send what’s changed.
 */
export interface ProjectUpdate {
    title?: string;
    shortDesc?: string;
    detailDesc?: string;
    thumbnail?: string;
    demoUrl?: string;
    githubUrl?: string;
    techTags?: string[];
}

export interface AdminProject {
    id: number;
    title: string;
    status: "Published" | "Draft" | string;
    views: number;
    comments: number;
    createdAt: string; // ISO date
}
