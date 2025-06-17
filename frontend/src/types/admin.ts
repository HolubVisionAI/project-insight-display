export interface AdminProject {
  id: number;
  title: string;
  status: "Published" | "Draft" | string;
  views: number;
  comments: number;
  createdAt: string; // ISO date
}
