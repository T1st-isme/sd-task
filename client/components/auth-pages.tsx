"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icon";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const { forgotPassword, loading, error } = useAuth();

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        forgotPassword(email);
    }

    return (
        <Card className="w-[380px]">
            <CardHeader>
                <CardTitle>Forgot Password</CardTitle>
                <CardDescription>
                    Enter your email to reset your password
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-2">
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="email">
                                Email
                            </Label>
                            <Input
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={loading}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button disabled={loading}>
                            {loading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Reset Password
                        </Button>
                    </div>
                    {error && (
                        <p className="text-red-500 text-xs mt-1">{error}</p>
                    )}
                </form>
            </CardContent>
            <CardFooter>
                <Link href="/" className="w-full">
                    <Button variant="outline" className="w-full">
                        Back to Login
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}

function SetNewPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(true);
    const token = searchParams.get("token");

    const { resetPassword, loading, error } = useAuth();

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordMatch(false);
            return;
        }
        if (token) {
            resetPassword(token, newPassword);
        }

        setTimeout(() => {
            router.push("/");
        }, 3000);
    }

    const handleConfirmPasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setConfirmPassword(e.target.value);
        setPasswordMatch(e.target.value === newPassword);
    };

    return (
        <Card className="w-[380px]">
            <CardHeader>
                <CardTitle>Set New Password</CardTitle>
                <CardDescription>Enter your new password</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-2">
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="new-password">
                                New Password
                            </Label>
                            <Input
                                id="new-password"
                                placeholder="New Password"
                                type="password"
                                autoCapitalize="none"
                                autoComplete="new-password"
                                disabled={loading}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label
                                className="sr-only"
                                htmlFor="confirm-password"
                            >
                                Confirm New Password
                            </Label>
                            <Input
                                id="confirm-password"
                                className={`pl-10 w-full px-3 py-2 border ${
                                    passwordMatch
                                        ? "border-gray-300"
                                        : "border-red-500"
                                } rounded-md focus:outline-none focus:ring-2 ${
                                    passwordMatch
                                        ? "focus:ring-blue-500"
                                        : "focus:ring-red-500"
                                }`}
                                placeholder="Confirm New Password"
                                type="password"
                                autoCapitalize="none"
                                autoComplete="new-password"
                                disabled={loading}
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
                        <Button disabled={loading}>
                            {loading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Set New Password
                        </Button>
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs mt-1">{error}</p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

export default function AuthPages() {
    const pathname = usePathname();

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            {pathname === "/forgot-password" && <ForgotPasswordPage />}
            {pathname === "/reset-password" && <SetNewPasswordPage />}
        </div>
    );
}
