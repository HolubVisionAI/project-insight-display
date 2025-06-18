// src/hooks/useAuth.ts
import {createContext, useContext, useState, useEffect} from "react";

interface AuthContextValue {
    user: { name: string; is_admin: boolean } | null;
    login: (u: { name: string; is_admin: boolean }) => void;
    logout: () => void;
    initialized: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthContextValue["user"]>(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        // e.g. read from localStorage or call an API
        const saved = localStorage.getItem("user");
        if (saved) setUser(JSON.parse(saved));
        setInitialized(true);
    }, []);

    const login = (u: AuthContextValue["user"]) => {
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{user, login, logout, initialized}}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be inside AuthProvider");
    return ctx;
}
