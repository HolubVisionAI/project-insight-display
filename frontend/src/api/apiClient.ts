// src/api/apiClient.ts
export async function apiFetch(
    input: RequestInfo,
    init?: RequestInit
): Promise<Response> {
    const resp = await fetch(input, init);

    if (resp.status === 401) {
        // tell AuthProvider to log out
        window.dispatchEvent(new Event("logoutEvent"));
        // optionally you can await resp.json() to read { detail: "..."}
        throw new Error("Unauthorized");
    }

    return resp;
}
