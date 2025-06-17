// src/hooks/useProject.ts
import {useState, useEffect} from "react";
import type {Project} from "@/types/projects.ts"
import {getProjectApi} from "@/api/projects";

export function useProject(id: number) {
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        let canceled = false;
        setIsLoading(true);
        setError(null);

        getProjectApi(id)
            .then((proj) => {
                if (!canceled) setProject(proj);
            })
            .catch((err: any) => {
                if (!canceled) setError(err.message);
            })
            .finally(() => {
                if (!canceled) setIsLoading(false);
            });

        return () => {
            canceled = true;
        };
    }, [id]);

    return {project, isLoading, error};
}
