
import { useState } from "react";
import ProjectCard from "./ProjectCard";

const ProjectGallery = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with React, Node.js, and PostgreSQL",
      tags: ["React", "Node.js", "PostgreSQL"],
      thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
      demoUrl: "#",
      githubUrl: "#",
      createdAt: "2025-06-01"
    },
    {
      id: 2,
      title: "AI Chatbot Interface",
      description: "Intelligent chatbot with natural language processing capabilities",
      tags: ["React", "Python", "Flask", "AI"],
      thumbnail: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=250&fit=crop",
      demoUrl: "#",
      githubUrl: "#",
      createdAt: "2025-05-15"
    },
    {
      id: 3,
      title: "Project Manager Dashboard",
      description: "Comprehensive project management tool with real-time collaboration",
      tags: ["React", "FastAPI", "MongoDB"],
      thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop",
      demoUrl: "#",
      githubUrl: "#",
      createdAt: "2025-04-20"
    },
    {
      id: 4,
      title: "Weather Analytics App",
      description: "Beautiful weather dashboard with data visualization",
      tags: ["React", "Python", "D3.js"],
      thumbnail: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=250&fit=crop",
      demoUrl: "#",
      githubUrl: "#",
      createdAt: "2025-03-10"
    },
    {
      id: 5,
      title: "Social Media Analytics",
      description: "Comprehensive social media monitoring and analytics platform",
      tags: ["React", "Flask", "Redis"],
      thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
      demoUrl: "#",
      githubUrl: "#",
      createdAt: "2025-02-28"
    },
    {
      id: 6,
      title: "Content Management System",
      description: "Modern CMS with drag-and-drop page builder",
      tags: ["React", "FastAPI", "PostgreSQL"],
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      demoUrl: "#",
      githubUrl: "#",
      createdAt: "2025-01-15"
    }
  ];

  const allTags = ["All", ...Array.from(new Set(projects.flatMap(project => project.tags)))];

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(project => project.tags.includes(activeFilter));

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work, featuring modern web applications
            built with cutting-edge technologies
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
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectGallery;
