// src/pages/AddProjectPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCreateProject } from "@/hooks/useCreateProject";
import { ProjectForm } from "@/components/ProjectForm";

export default function AddProjectPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate: createProject } = useCreateProject();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    demoUrl: "",
    githubUrl: "",
    thumbnail: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    const t = newTag.trim();
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Missing fields",
        description: "Title and description are required.",
        variant: "destructive",
      });
      return;
    }
    setErrorMsg(null);

    createProject(
      {
        title: formData.title,
        shortDesc: formData.description,
        thumbnail: formData.thumbnail || undefined,
        demoUrl: formData.demoUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
        techTags: tags,
      },
      {
        onSuccess() {
          toast({
            title: "Success",
            description: "Project created successfully!",
          });
          navigate("/admin");
        },
        onError(err: Error) {
          setErrorMsg(err.message);
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ... your header ... */}

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <ProjectForm
          formData={formData}
          tags={tags}
          newTag={newTag}
          isLoading={false}
          errorMsg={errorMsg}
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
