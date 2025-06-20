// src/pages/LoginPage.tsx
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useLogin} from "@/hooks/useLogin";
import {useAuth} from "@/hooks/useAuth";         // ← import your auth hook
import {LoginForm} from "@/components/LoginForm";

export default function LoginPage() {
    const navigate = useNavigate();
    const {login: setUser} = useAuth();           // ← get the login function from context
    const {mutate, isLoading, error} = useLogin();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = () => {
        mutate(
            {email, password},
            {
                onSuccess(data) {
                    // 1) persist your token however you like
                    localStorage.setItem("access_token", data.access_token);
                    console.log(data);
                    // 2) update React context so Header will re-render
                    setUser({
                        name: data.user.name,          // assume your API returns some user object
                        is_admin: data.user.is_admin,
                    });

                    if (data.user.is_admin)
                        navigate("/admin");
                    else
                        navigate("/");
                },
            }
        );
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
