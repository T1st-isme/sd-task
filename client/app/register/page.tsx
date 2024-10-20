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

export default function RegisterPage() {
    const { loading, register, error, user } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(true);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !email || !password || !confirmPassword) {
            return;
        }
        if (password !== confirmPassword) {
            setPasswordMatch(false);
            return;
        }
        try {
            await register(username, email, password, confirmPassword);
        } catch (error) {
            console.error("An error occurred during register: " + error);
        }
    };

    useEffect(() => {
        if (user) {
            console.log("register user", user);
            router.push("/");
        }
    }, [user, router]);

    const handleConfirmPasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setConfirmPassword(e.target.value);
        setPasswordMatch(e.target.value === password);
    };

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
                        Register
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="johndoe"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="johndoe@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                <Label htmlFor="confirmPassword">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    className={`pl-10 w-full px-3 py-2 border ${
                                        passwordMatch
                                            ? "border-gray-300"
                                            : "border-red-500"
                                    } rounded-md focus:outline-none focus:ring-2 ${
                                        passwordMatch
                                            ? "focus:ring-blue-500"
                                            : "focus:ring-red-500"
                                    }`}
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    required
                                />
                            </div>
                            {!passwordMatch && (
                                <p className="text-red-500 text-xs mt-1">
                                    Passwords do not match
                                </p>
                            )}
                            {error && (
                                <p className="text-sm text-red-500">{error}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full mt-4">
                            Register
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-primary hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
