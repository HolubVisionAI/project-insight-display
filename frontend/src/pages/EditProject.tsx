// src/pages/EditProjectPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUpdateProject } from "@/hooks/useUpdateProject";
import { useProject } from "@/hooks/useProject";
import type { ProjectUpdate } from "@/types/projects";
import { ProjectForm } from "@/components/ProjectForm";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  const navigate = useNavigate();
  const { toast } = useToast();

  // --- load existing project via hook ---
  const {
    project,
    isLoading: isLoadingProject,
    error: loadError,
  } = useProject(projectId);

  // --- update hook ---
  const {
    updateProject,
    isUpdating,
    error: updateError,
  } = useUpdateProject();

  // --- form local state (seeded once project arrives) ---
  const [formData, setFormData] = useState({
    title: "",
    shortDesc: "",
    detailDesc: "",
    demoUrl: "",
    githubUrl: "",
    thumbnail: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // once `project` is loaded, initialize form
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        shortDesc: project.shortDesc,
        detailDesc: project.detailDesc ?? "",
        demoUrl: project.demoUrl ?? "",
        githubUrl: project.githubUrl ?? "",
        thumbnail: project.thumbnail ?? "",
      });
      setTags(project.techTags ?? []);
    }
  }, [project]);

  // --- form handlers ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };
  const handleAddTag = () => {
    const t = newTag.trim();
    if (t && !tags.includes(t)) {
      setTags((p) => [...p, t]);
      setNewTag("");
    }
  };
  const handleRemoveTag = (tag: string) =>
    setTags((p) => p.filter((t) => t !== tag));

  // --- submit via the updateProject hook ---
  const handleSubmit = async () => {
    if (!formData.title || !formData.shortDesc) {
      toast({
        title: "Missing fields",
        description: "Title and description are required.",
        variant: "destructive",
      });
      return;
    }

    const payload: ProjectUpdate = {
      title: formData.title,
      shortDesc: formData.shortDesc,
      detailDesc: formData.detailDesc || undefined,
      demoUrl: formData.demoUrl || undefined,
      githubUrl: formData.githubUrl || undefined,
      thumbnail: formData.thumbnail || undefined,
      techTags: tags,
    };

    setErrorMsg(null);
    try {
      await updateProject(projectId, payload);
      toast({
        title: "Updated",
        description: "Project updated successfully.",
      });
      navigate("/admin");
    } catch (err: any) {
      setErrorMsg(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // --- render ---
  if (isLoadingProject) return <p>Loading project…</p>;
  if (loadError)
    return <p className="text-red-600">Error loading: {loadError}</p>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <ProjectForm
          formData={formData}
          tags={tags}
          newTag={newTag}
          isLoading={isUpdating}
          errorMsg={errorMsg || updateError}
          onInputChange={handleInputChange}
          onNewTagChange={setNewTag}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
