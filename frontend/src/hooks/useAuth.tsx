// src/hooks/useAuth.ts
import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import {useNavigate} from "react-router-dom";

interface AuthContextValue {
    user: { name: string; is_admin: boolean } | null;
    login: (u: { name: string; is_admin: boolean }) => void;
    logout: () => void;
    initialized: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthContextValue["user"]>(null);
    const [initialized, setInitialized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // hydrate from localStorage on startup
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
        localStorage.removeItem("access_token");
        // send them to the login page
        navigate("/login", {replace: true});
    };

    // if anyone ever dispatches window.logoutEvent, run our logout()
    useEffect(() => {
        const onLogout = () => logout();
        window.addEventListener("logoutEvent", onLogout);
        return () => {
            window.removeEventListener("logoutEvent", onLogout);
        };
    }, []);

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
