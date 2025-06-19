// src/api/auth.ts
export interface TokenResponse {
    access_token: string;
    token_type: string;
}

const BASE = `${import.meta.env.VITE_API_URL}/api/v1/auth`;

export async function loginApi(
    email: string,
    password: string
): Promise<TokenResponse> {
    const formBody = new URLSearchParams();
    formBody.append("username", email);
    formBody.append("password", password);

    const resp = await fetch(`${BASE}/login`, {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: formBody.toString(),
    });

    if (!resp.ok) {
        if (resp.status === 401) {
            throw new Error("Incorrect email or password");
        }
        throw new Error(`Login failed (status ${resp.status})`);
    }

    return resp.json();
}

export interface User {
    id: number;
    name: string;
    email: string;
    // …any other fields from schemas.User
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
