import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { StatsCards } from "@/components/StatsCards";
import { ProjectsTable } from "@/components/ProjectsTable";

export default function AdminDashboard() {
  const { projects, loading, error, removeProject } = useProjects();
  // console.log(projects);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading projects…
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your portfolio projects
            </p>
          </div>
          <div className="flex space-x-2">
            <Link to="/">
              <Button variant="outline">View Site</Button>
            </Link>
            {/*<Link to="/admin/users">*/}
            {/*  <Button variant="outline">*/}
            {/*    <Users size={16} className="mr-2" />*/}
            {/*    Users*/}
            {/*  </Button>*/}
            {/*</Link>*/}
            <Link to="/admin/add-project">
              <Button>
                <Plus size={16} className="mr-2" />
                New Project
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <StatsCards projects={projects} />

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Projects</h2>
          </div>
          <div className="card-content">
            <ProjectsTable
              projects={projects}
              onDelete={removeProject}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
