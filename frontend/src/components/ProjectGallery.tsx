import {useState, useMemo} from "react";
import {useProjects} from "@/hooks/useProjects";
import ProjectCard from "./ProjectCard";
import {AlertTriangle} from "lucide-react";

const ProjectGallery = () => {
    // 1️⃣ Fetch all projects (and removal fn) from your hook
    const {
        projects,
        loading,
        error,
        removeProject,     // call this with an ID to delete
    } = useProjects();
    // 2️⃣ Local UI state for the tag filter
    const [activeFilter, setActiveFilter] = useState("All");

    // 1) Build tag list safely
    const allTags = useMemo(() => {
        if (!projects || projects.length === 0) {
            return ["All"];
        }
        const tags = new Set<string>();
        projects.forEach((p) => {
            // guard p.techTags too if needed
            p.techTags?.forEach((t) => tags.add(t));
        });
        return ["All", ...Array.from(tags)];
    }, [projects]);

    // 2) Filtered list safely
    const filtered = useMemo(() => {
        if (!projects) return [];
        if (activeFilter === "All") return projects;
        return projects.filter((p) => p.techTags.includes(activeFilter));
    }, [projects, activeFilter]);


    // 5️⃣ Loading & error states
    if (loading) {
        return (
            <div className="min-h-[200px] flex items-center justify-center">
                <p>Loading projects…</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="min-h-[200px] flex items-center justify-center text-red-600">
                <AlertTriangle className="mr-2"/>
                <span>Error: {error}</span>
            </div>
        );
    }

    return (
        <section id="projects" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Featured Projects
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        A showcase of my recent work, featuring modern web applications
                        built with cutting-edge technologies.
                    </p>
                </div>

                {/* Filter Tags */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setActiveFilter(tag)}
                            className={`px-4 py-2 rounded-full border transition-all duration-200 hover:scale-105 ${
                                activeFilter === tag
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((project) => (
                        <div key={project.id} className="relative">
                            {/* Pass removeProject down, or handle here */}
                            <button
                                onClick={() => removeProject(project.id)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                title="Remove project"
                            >
                                ✕
                            </button>

                            <ProjectCard project={project}/>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectGallery;
