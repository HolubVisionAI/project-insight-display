import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Project } from "@/types/projects";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  // console.log(project)
  const handleCardClick = () => {
    navigate(`/project/${project.id}`);
  };

  const handleButtonClick = (e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (url) window.open(url, "_blank");
  };

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.03] bg-card border-border overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        {project.thumbnail && (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
          {project.demoUrl && (
            <Button
              size="sm"
              variant="secondary"
              className="opacity-90 hover:opacity-100"
              onClick={(e) => handleButtonClick(e, project.demoUrl)}
            >
              <ExternalLink size={16} className="mr-2" />
              Demo
            </Button>
          )}
          {project.githubUrl && (
            <Button
              size="sm"
              variant="secondary"
              className="opacity-90 hover:opacity-100"
              onClick={(e) => handleButtonClick(e, project.githubUrl)}
            >
              <Github size={16} className="mr-2" />
              Code
            </Button>
          )}
        </div>
      </div>

      <CardHeader>
        <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors duration-200">
          {project.title}
        </h3>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground mb-4 text-sm">
          {project.shortDesc}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.techTags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        Created: {new Date(project.createdAt).toLocaleDateString()}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
