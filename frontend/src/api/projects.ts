// src/api/projects.ts
import type {ProjectCreate, ProjectUpdate, Project} from "@/types/projects";
import {apiFetch} from "@/api/apiClient.ts"

const BASE = `${import.meta.env.VITE_API_URL}/api/v1/projects`;

// ——— Helpers ——————————————————————————————————

/** Always include the bearer token if present */
function getAuthHeaders() {
    const raw = localStorage.getItem("auth");
    const data = JSON.parse(raw);
    // pull out the token
    const token: string | undefined = data.access_token;
    // const token = localStorage.getItem("access_token");
    return token ? {Authorization: `Bearer ${token}`} : {};
}

/**
 * Parse JSON & throw if status >= 400, using the same logic as your createProjectApi.
 */
async function handleResponse<T>(resp: Response): Promise<T> {
    let payload: any;
    try {
        payload = await resp.json();
    } catch {
        if (!resp.ok) {
            throw new Error(`Request failed with status ${resp.status}`);
        }
        throw new Error("Invalid JSON response from server");
    }

    if (!resp.ok) {
        const detail = payload.detail;
        const message =
            typeof detail === "string"
                ? detail
                : Array.isArray(detail)
                    ? detail.map((e: any) => e.msg || JSON.stringify(e)).join("; ")
                    : `Error ${resp.status}`;
        throw new Error(message);
    }

    return payload as T;
}

// ——— CRUD functions ——————————————————————————————————

/** Create a new project */
export async function createProjectApi(
    project: ProjectCreate
): Promise<Project> {
    const resp = await fetch(`${BASE}/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
        body: JSON.stringify(project),
    });

    return handleResponse<Project>(resp);
}


/** GET /api/v1/projects */
export async function listProjectsApi(): Promise<Project[]> {
    const raw = localStorage.getItem("auth");

    const data = JSON.parse(raw);
    // pull out the token
    const token: string | undefined = data.access_token;

    const res = await apiFetch(`${BASE}/`, {
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
    });
    const payload = await res.json().catch(() => {
        if (!res.ok) throw new Error(`Request failed ${res.status}`);
        throw new Error("Invalid JSON");
    });
    if (!res.ok) {
        const detail = payload.detail;
        const msg =
            typeof detail === "string"
                ? detail
                : Array.isArray(detail)
                    ? detail.map((e: any) => e.msg).join("; ")
                    : `Error ${res.status}`;
        throw new Error(msg);
    }
    // Map snake_case ↔ camelCase if needed
    return payload.map((p: any) => ({
        id: p.id,
        title: p.title,
        shortDesc: p.shortDesc,
        detailDesc: p.detailDesc,
        thumbnail: p.thumbnail,
        status: p.status,
        views: p.viewCount,
        comments: p.comments,
        createdAt: p.createdAt,
        techTags: p.techTags
    }));
}

/** DELETE /api/v1/projects/:id */
export async function deleteProjectApi(id: number): Promise<void> {
    const token = localStorage.getItem("access_token");
    const res = await apiFetch(`${BASE}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
    });
    if (!res.ok) {
        let payload: any = {};
        try {
            payload = await res.json();
        } catch {
        }
        const detail = payload.detail;
        const msg =
            typeof detail === "string"
                ? detail
                : `Error ${res.status}`;
        throw new Error(msg);
    }
}

/** PUT /api/v1/projects/:id */
export async function updateProjectApi(
    id: number,
    project: ProjectUpdate
): Promise<Project> {
    const resp = await apiFetch(`${BASE}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
        body: JSON.stringify(project),
    });
    return handleResponse<Project>(resp);
}

/** GET /api/v1/projects/:id */
export async function getProjectApi(id: number): Promise<Project> {
    const resp = await fetch(`${BASE}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
    });
    if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `Failed to fetch project #${id}`);
    }
    return handleResponse<Project>(resp);
}
