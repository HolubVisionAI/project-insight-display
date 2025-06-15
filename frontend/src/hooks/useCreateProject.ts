import { useMutation } from "@tanstack/react-query";
import { createProjectApi, Project, ProjectCreate } from "@/api/projects";

export function useCreateProject() {
  return useMutation<Project, Error, ProjectCreate>({
    mutationFn: createProjectApi,
  });
}
