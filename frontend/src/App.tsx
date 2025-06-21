// App.tsx
import {FC, useEffect} from 'react';
import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {HashRouter, Routes, Route} from "react-router-dom";
import Index from "./pages/Index";
import ProjectDetail from "./pages/ProjectDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddProject from "./pages/AddProject";
import EditProject from "./pages/EditProject";
import AdminUsers from "./pages/AdminUsers";
import NotFound from "./pages/NotFound";
import {AuthProvider} from "@/hooks/useAuth.tsx";
import {ProtectedRoute} from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App: FC = () => {
    // to prevent sleep backend
    useEffect(() => {
        const keepAlive = () => {
            fetch(`${import.meta.env.VITE_API_URL}/ping`).catch(() => {
            });
        };
        keepAlive();
        const id = setInterval(keepAlive, 14 * 60 * 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <HashRouter>
                <TooltipProvider>
                    <AuthProvider>
                        <Toaster/>
                        <Sonner/>
                        <Routes>
                            <Route path="/" element={<Index/>}/>
                            <Route path="/project/:id" element={<ProjectDetail/>}/>
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute>
                                        <AdminDashboard/>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/add-project"
                                element={
                                    <ProtectedRoute>
                                        <AddProject/>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/edit-project/:id"
                                element={
                                    <ProtectedRoute>
                                        <EditProject/>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/users"
                                element={
                                    <ProtectedRoute>
                                        <AdminUsers/>
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/register" element={<Register/>}/>
                            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                            <Route path="*" element={<NotFound/>}/>
                        </Routes>
                    </AuthProvider>
                </TooltipProvider>
            </HashRouter>
        </QueryClientProvider>
    );
};

export default App;
