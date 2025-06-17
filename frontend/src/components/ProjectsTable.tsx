import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Link} from "react-router-dom";
import {Eye, Edit, Trash2} from "lucide-react";
import type {AdminProject} from "@/types/admin";

interface ProjectsTableProps {
    projects: AdminProject[];
    onDelete: (id: number) => void;
}

export function ProjectsTable({projects, onDelete}: ProjectsTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {projects.map((p) => (
                    <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.title}</TableCell>
                        <TableCell>
                            <Badge variant={p.status === "Published" ? "default" : "secondary"}>
                                {p.status}
                            </Badge>
                        </TableCell>
                        <TableCell>{p.views}</TableCell>
                        <TableCell>{p.comments}</TableCell>
                        <TableCell>
                            {new Date(p.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                            <div className="flex space-x-2">
                                <Link to={`/project/${p.id}`}>
                                    <Button variant="ghost" size="sm">
                                        <Eye size={14}/>
                                    </Button>
                                </Link>
                                <Link to={`/admin/edit-project/${p.id}`}>
                                    <Button variant="ghost" size="sm">
                                        <Edit size={14}/>
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        if (
                                            window.confirm(
                                                "Are you sure you want to delete this project?"
                                            )
                                        ) {
                                            onDelete(p.id);
                                        }
                                    }}
                                >
                                    <Trash2 size={14}/>
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
