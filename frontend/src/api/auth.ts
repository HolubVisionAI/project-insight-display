// src/api/auth.ts

import {jwtDecode} from "jwt-decode";

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    created_at: string;
}

// now include the user in the stored shape:
export interface StoredAuth extends TokenResponse {
    user: User;
    /** ms‐since‐epoch when this token expires */
    expiresAt: number;
}

const BASE = `${import.meta.env.VITE_API_URL}/api/v1/auth`;

/** Pull `exp` out of the JWT and convert to milliseconds */
function getExpiryFromToken(token: string): number {
    type Payload = { exp: number };
    const {exp} = jwtDecode<Payload>(token);
    return exp * 1_000;
}

export async function loginApi(
    email: string,
    password: string
): Promise<StoredAuth> {
    const formBody = new URLSearchParams();
    formBody.append("username", email);
    formBody.append("password", password);

    const resp = await fetch(`${BASE}/login`, {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: formBody.toString(),
    });

    if (!resp.ok) {
        if (resp.status === 401) throw new Error("Incorrect email or password");
        throw new Error(`Login failed (status ${resp.status})`);
    }

    // the backend now returns `{ access_token, token_type, user }`
    const {access_token, token_type, user} = (await resp.json()) as {
        access_token: string;
        token_type: string;
        user: User;
    };

    const expiresAt = getExpiryFromToken(access_token);
    const stored: StoredAuth = {access_token, token_type, user, expiresAt};

    localStorage.setItem("auth", JSON.stringify(stored));

    // Optional: schedule auto‐logout
    const msUntilExpiry = expiresAt - Date.now();
    setTimeout(() => {
        console.warn("Token expired—logging out");
        localStorage.removeItem("auth");
        window.dispatchEvent(new Event("logoutEvent"));
    }, msUntilExpiry);

    return stored;
}

/** Load & validate that same object from localStorage, or null if missing/expired */
export function loadStoredAuth(): StoredAuth | null {
    const raw = localStorage.getItem("auth");
    if (!raw) return null;
    try {
        const obj = JSON.parse(raw) as StoredAuth;
        // expired?
        if (Date.now() > obj.expiresAt) {
            localStorage.removeItem("auth");
            return null;
        }
        return obj;
    } catch {
        localStorage.removeItem("auth");
        return null;
    }
}


export interface User {
    id: number;
    name: string;
    email: string;
}

export async function registerApi(
    name: string,
    email: string,
    password: string
): Promise<User> {
    const formBody = new URLSearchParams({name, email, password});
    const resp = await fetch(`${BASE}/register`, {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: formBody.toString(),
    });

    // If the status isn’t 2xx, try to parse an error payload,
    // but fall back to a generic message if parsing fails:
    if (!resp.ok) {
        let detail: unknown;
        try {
            const errJson = await resp.json();
            detail = (errJson as any).detail;
        } catch {
            throw new Error(`Registration failed (${resp.status})`);
        }

        const msg =
            typeof detail === "string"
                ? detail
                : Array.isArray(detail)
                    ? detail.map((e: any) => e.msg).join("; ")
                    : `Registration failed (${resp.status})`;

        throw new Error(msg);
    }

    // At this point, we have a 2xx — parse the user JSON,
    // but still guard against an empty or malformed body:
    try {
        return (await resp.json()) as User;
    } catch {
        throw new Error("Unexpected empty or invalid response from server");
    }
}
