import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import {useNavigate} from "react-router-dom";
import {loadStoredAuth, StoredAuth} from "@/api/auth";

interface AuthContextValue {
    user: { email: string; is_admin: boolean } | null;
    auth: StoredAuth | null;
    login: (auth: StoredAuth) => void;
    logout: () => void;
    initialized: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthContextValue["user"]>(null);
    const [auth, setAuth] = useState<AuthContextValue["auth"]>(null);
    const [initialized, setInitialized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // On startup, try to load a valid auth blob:
        const stored = loadStoredAuth();
        if (stored) {
            setUser({email: stored.user.email, is_admin: stored.user.is_admin});
            setAuth(stored);
        }
        setInitialized(true);
    }, []);

    const login = (newAuth: StoredAuth) => {
        setAuth(newAuth);
        setUser({email: newAuth.user.email, is_admin: newAuth.user.is_admin});
        localStorage.setItem("auth", JSON.stringify(newAuth));
        if (newAuth.user.is_admin)
            navigate("/admin", {replace: true});
        else
            navigate("/", {replace: true});

    };

    const logout = () => {
        setAuth(null);
        setUser(null);
        localStorage.removeItem("auth");
        navigate("/login", {replace: true});
    };

    // Allow global logout via dispatched event
    useEffect(() => {
        const handler = () => logout();
        window.addEventListener("logoutEvent", handler);
        return () => window.removeEventListener("logoutEvent", handler);
    }, []);

    return (
        <AuthContext.Provider
            value={{user, auth, login, logout, initialized}}
        >
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be inside AuthProvider");
    return ctx;
}
