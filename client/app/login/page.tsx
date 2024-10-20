"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { loading, login, error, user } = useAuth();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!identifier || !password) {
            return;
        }
        try {
            await login(identifier, password, code);
        } catch (error) {
            console.error("An error occurred during login: " + error);
        }
    };

    useEffect(() => {
        if (user) {
            if (user.roles?.includes("admin")) {
                router.push("/admin");
            } else {
                router.push("/");
            }
        }
    }, [user, router]);

    return loading ? (
        <Loader2 />
    ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <UserCircle className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-center">
                        Login
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email or Username</Label>
                                <Input
                                    id="identifier"
                                    type="text"
                                    placeholder="m@example.com"
                                    value={identifier}
                                    onChange={(e) =>
                                        setIdentifier(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="code">Code</Label>
                                <Input
                                    id="code"
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-500">{error}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full mt-4">
                            Sign in
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center space-y-2">
                    <Link
                        href="/forgot-password"
                        className="text-sm text-primary hover:underline"
                    >
                        Forgot your password?
                    </Link>
                    <p className="text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="text-primary hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
