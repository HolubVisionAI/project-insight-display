export interface ProjectCreate {
  title: string;
  shortDesc: string;
  thumbnail?: string;
  demoUrl?: string;
  githubUrl?: string;
  techTags: string[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  demoUrl?: string;
  githubUrl?: string;
  techTags: string[];
}

export async function createProjectApi(
  project: ProjectCreate
): Promise<Project> {
  const token = localStorage.getItem("access_token");
  const resp = await fetch(`/api/v1/projects/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(project),
  });

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
        ? detail.map((e: any) => e.msg).join("; ")
        : `Error ${resp.status}`;
    throw new Error(message);
  }

  return payload as Project;
}
