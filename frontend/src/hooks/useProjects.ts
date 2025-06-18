import {useState, useEffect, useCallback} from "react";
import type {Project} from "@/types/projects";
import {
    listProjectsApi,
    deleteProjectApi,
} from "@/api/projects";

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await listProjectsApi();
            setProjects(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const removeProject = useCallback(
        async (id: number) => {
            await deleteProjectApi(id);
            // refresh list after delete
            fetchProjects();
        },
        [fetchProjects]
    );

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return {projects, loading, error, removeProject};
}
