// src/components/ProtectedRoute.tsx
import {ReactNode} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {useAuth} from "@/hooks/useAuth";

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({children}: ProtectedRouteProps) {
    const {user, initialized} = useAuth();
    const location = useLocation();

    // If not logged in, redirect to /login
    // and remember the page they tried to visit
    if (!initialized) {
        return null; // or <LoadingSpinner />
    }
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{from: location.pathname}}
            />
        );
    }

    // Otherwise render the protected content
    return <>{children}</>;
}
