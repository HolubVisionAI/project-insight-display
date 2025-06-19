
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, UserPlus, Edit, Trash2, Shield, User } from "lucide-react";
import { Link } from "react-router-dom";

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: "Ihor Holub",
    email: "ihor@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-01-15",
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@example.com",
    role: "User",
    status: "Active",
    lastLogin: "2024-01-14",
    createdAt: "2024-01-05",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "User",
    status: "Inactive",
    lastLogin: "2024-01-10",
    createdAt: "2024-01-03",
  },
];

const AdminUsers = () => {
  const [users] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === "Active").length,
    adminUsers: users.filter(u => u.role === "Admin").length,
    inactiveUsers: users.filter(u => u.status === "Inactive").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">User Management</h1>
              <p className="text-muted-foreground">Manage users and permissions</p>
            </div>
          </div>
          <Button>
            <UserPlus size={16} className="mr-2" />
            Add User
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <User size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <User size={16} className="text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <Shield size={16} className="text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.adminUsers}</div>
              <p className="text-xs text-muted-foreground">
                Admin privileges
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
              <User size={16} className="text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inactiveUsers}</div>
              <p className="text-xs text-muted-foreground">
                Need attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Users</CardTitle>
              <div className="relative w-64">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === "Active" ? "default" : "destructive"}
                        className={user.status === "Active" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;
