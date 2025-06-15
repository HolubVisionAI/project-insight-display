import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Eye, EyeOff} from "lucide-react";

interface Props {
    email: string;
    password: string;
    showPassword: boolean;
    isLoading: boolean;
    errorMsg: string | null;
    onEmailChange: (v: string) => void;
    onPasswordChange: (v: string) => void;
    onToggleShow: () => void;
    onSubmit: () => void;
}

export function LoginForm({
                              email,
                              password,
                              showPassword,
                              isLoading,
                              errorMsg,
                              onEmailChange,
                              onPasswordChange,
                              onToggleShow,
                              onSubmit,
                          }: Props) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                <p className="text-muted-foreground">Sign in to your account</p>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                    className="space-y-4"
                >
                    {errorMsg && <p className="text-sm text-destructive text-center">{errorMsg}</p>}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => onEmailChange(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => onPasswordChange(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={onToggleShow}
                            >
                                {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                            </Button>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing in…" : "Sign In"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Don’t have an account?{" "}
                        <a href="/register" className="text-primary hover:underline">
                            Sign up
                        </a>
                    </p>
                </div>

                <div className="mt-4 text-center">
                    <a href="/" className="text-sm text-muted-foreground hover:text-primary">
                        ← Back to Portfolio
                    </a>
                </div>
            </CardContent>
        </Card>
    );
}
