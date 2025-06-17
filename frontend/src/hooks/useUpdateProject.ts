// src/hooks/useUpdateProject.ts
import { useState, useCallback } from "react";
import type { ProjectUpdate } from "@/types/projects";
import type { AdminProject } from "@/types/admin";
import { updateProjectApi } from "@/api/projects";

export function useUpdateProject() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Call this with (id, data).
   * Returns the updated project on success, or throws on error.
   */
  const updateProject = useCallback(
    async (id: number, data: ProjectUpdate): Promise<AdminProject> => {
      setIsUpdating(true);
      setError(null);
      try {
        const updated = await updateProjectApi(id, data);
        return updated;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  return { updateProject, isUpdating, error };
}
