import React from "react";
import { useParams, Link } from "react-router-dom";
import { useProject } from "@/hooks/useProject";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  ExternalLink,
  Github,
  ArrowLeft,
  Eye,
  MessageCircle,
} from "lucide-react";
import CommentSection from "@/components/CommentSection";

export default function ProjectDetail() {
  // 1) grab the :id param and coerce to number
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);

  // 2) fetch via your hook
  const {
    project,
    isLoading: isLoadingProject,
    error: loadError,
  } = useProject(projectId);

  // 3) UI for loading / error
  if (isLoadingProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading project…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">
          Error loading project: {loadError.message}
        </p>
      </div>
    );
  }

  // 4) not found
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Link to="/">
            <Button>
              <ArrowLeft size={16} className="mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 5) main render
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Top info */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">{project.title}</h1>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Eye size={16} className="mr-1" />
              {project.viewCount}
            </span>
            <span className="flex items-center">
              <MessageCircle size={16} className="mr-1" />
              {project.comments}
            </span>
          </div>
        </div>

        {/* Thumbnail & Short */}
        {project.thumbnail && (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        )}
        <p className="text-lg text-muted-foreground">
          {project.shortDesc}
        </p>

        {/* Detail with preserved newlines */}
        <div className="prose max-w-none whitespace-pre-wrap">
          {project.detailDesc}
        </div>

        {/* Tags */}
        {project.techTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.techTags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          {project.demoUrl && (
            <Button
              size="lg"
              onClick={() => window.open(project.demoUrl, "_blank")}
            >
              <ExternalLink size={16} className="mr-2" />
              Live Demo
            </Button>
          )}
          {project.githubUrl && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.open(project.githubUrl, "_blank")}
            >
              <Github size={16} className="mr-2" />
              View Code
            </Button>
          )}
        </div>

        {/* Comments Section */}
        <CommentSection projectId={project.id} />
      </div>
    </div>
  );
}
