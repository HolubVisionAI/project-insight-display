import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  FolderOpen,
  Eye,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import type { AdminProject } from "@/types/admin";

interface StatsCardsProps {
  projects: AdminProject[];
}

export function StatsCards({ projects }: StatsCardsProps) {
  const total = projects.length;
  const published = projects.filter((p) => p.status === "Published").length;
  const views = projects.reduce((sum, p) => sum + p.views, 0);
  const comments = projects.reduce((sum, p) => sum + p.comments, 0);
  const avgViews = total > 0 ? Math.round(views / total) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm">Total Projects</CardTitle>
          <FolderOpen size={16} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs">{published} published</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm">Total Views</CardTitle>
          <Eye size={16} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{views}</div>
          <p className="text-xs">Across all projects</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm">Comments</CardTitle>
          <MessageSquare size={16} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{comments}</div>
          <p className="text-xs">Community engagement</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm">Avg. Views</CardTitle>
          <BarChart3 size={16} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgViews}</div>
          <p className="text-xs">Per project</p>
        </CardContent>
      </Card>
    </div>
  );
}
