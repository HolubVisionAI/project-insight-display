// src/components/ProjectForm.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectFormProps {
  formData: {
    title: string;
    description: string;
    thumbnail: string;
    demoUrl: string;
    githubUrl: string;
  };
  tags: string[];
  newTag: string;
  isLoading: boolean;
  errorMsg: string | null;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onNewTagChange: (v: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onSubmit: () => void;
}

export function ProjectForm({
  formData,
  tags,
  newTag,
  isLoading,
  errorMsg,
  onInputChange,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
  onSubmit,
}: ProjectFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-6"
        >
          {errorMsg && (
            <p className="text-sm text-destructive text-center">{errorMsg}</p>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={onInputChange}
              placeholder="Enter project title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onInputChange}
              placeholder="Describe your project"
              rows={4}
              required
            />
          </div>

          {/* Thumbnail */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={onInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Demo URL */}
          <div className="space-y-2">
            <Label htmlFor="demoUrl">Demo URL</Label>
            <Input
              id="demoUrl"
              name="demoUrl"
              value={formData.demoUrl}
              onChange={onInputChange}
              placeholder="https://your-demo.com"
            />
          </div>

          {/* GitHub URL */}
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={onInputChange}
              placeholder="https://github.com/username/repo"
            />
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label>Tags</Label>
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => onNewTagChange(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), onAddTag())
                }
              />
              <Button type="button" onClick={onAddTag} size="sm">
                <Plus size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Creating…" : "Create Project"}
            </Button>
            <Link to="/admin" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
