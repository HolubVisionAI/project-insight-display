// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/useLogin";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutate, error } = useLogin();

  // your form fields:
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ← Add this state for the “show password” toggle:
  const [showPassword, setShowPassword] = useState(false);
  

  const handleSubmit = () => {
    mutate(
      { email, password },
      {
        onSuccess(data) {
          localStorage.setItem("access_token", data.access_token);
          navigate("/admin");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <LoginForm
        email={email}
        password={password}
        showPassword={showPassword}                      // now defined
        isLoading={false}
        errorMsg={error?.message ?? null}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onToggleShow={() => setShowPassword((v) => !v)}   // and this
        onSubmit={handleSubmit}
      />
    </div>
  );
}
