// pages/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "@/hooks/useRegister";
import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { mutate: register, error } = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const handleSubmit = () => {
    // client-side check
    if (password !== confirmPassword) {
      setClientError("Passwords do not match");
      return;
    }
    setClientError(null);

    // kick off the mutation, and log any thrown error
    register(
      { name, email, password },
      {
        onSuccess() {
          navigate("/login", { replace: true });
        },
        onError(err) {
          console.error("❌ registerApi threw:", err);
          // err is whatever `new Error(msg)` you threw in registerApi
          setClientError(err instanceof Error ? err.message : "Unknown error");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <RegisterForm
        name={name}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        isLoading={false}
        errorMsg={error?.message ?? null}
        onNameChange={setName}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onToggleShowPassword={() => setShowPassword((v) => !v)}
        onToggleShowConfirmPassword={() =>
          setShowConfirmPassword((v) => !v)
        }
        onSubmit={handleSubmit}
      />
    </div>
  );
}
