// src/pages/LoginPage.tsx
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useLogin} from "@/hooks/useLogin";
import {useAuth} from "@/hooks/useAuth";         // ← import your auth hook
import {LoginForm} from "@/components/LoginForm";

export default function LoginPage() {
    const navigate = useNavigate();
    const {login: setUser} = useAuth();           // ← get the login function from context
    const {mutate: login, isLoading, error} = useLogin();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = () => {

        login({email, password});
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
            <LoginForm
                email={email}
                password={password}
                showPassword={showPassword}
                isLoading={isLoading}               // ← pass the real loading state
                errorMsg={error?.message ?? null}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onToggleShow={() => setShowPassword((v) => !v)}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
