"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { QrCode, Loader2 } from "lucide-react";

export default function EnableTwoFactorAuth() {
    const [verificationCode, setVerificationCode] = useState("");
    const {
        enable2FA,
        loading,
        error,
        message,
        qrCodeDataURL,
        twoFactorSecret,
        verify2FA,
    } = useAuth();

    const handleVerify2FA = async () => {
        await verify2FA(verificationCode);
    };

    return (
        <>
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Enable Two-Factor Authentication</CardTitle>
                    <CardDescription>
                        Enhance the security of your account with 2FA
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!qrCodeDataURL && message !== "2FA verified" ? (
                        <Button
                            onClick={enable2FA}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enabling 2FA...
                                </>
                            ) : (
                                <>
                                    <QrCode className="mr-2 h-4 w-4" />
                                    Enable 2FA
                                </>
                            )}
                        </Button>
                    ) : message !== "2FA verified" ? (
                        <>
                            <div className="flex flex-col items-center space-y-4">
                                <Image
                                    src={qrCodeDataURL || ""}
                                    alt="Scan this QR code with your authenticator app"
                                    width={200}
                                    height={200}
                                    className="border border-gray-200 rounded-lg"
                                />
                                <div className="text-center">
                                    <p className="text-sm text-gray-500 mb-2">
                                        Scan the QR code or enter the secret
                                        manually:
                                    </p>
                                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                        {twoFactorSecret}
                                    </code>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="verificationCode">
                                    Verification Code
                                </Label>
                                <Input
                                    id="verificationCode"
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    value={verificationCode}
                                    onChange={(e) =>
                                        setVerificationCode(e.target.value)
                                    }
                                />
                            </div>
                        </>
                    ) : null}
                </CardContent>
                {qrCodeDataURL && message !== "2FA verified" && (
                    <CardFooter>
                        <Button
                            onClick={handleVerify2FA}
                            disabled={loading || verificationCode.length !== 6}
                            className="w-full"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                "Verify"
                            )}
                        </Button>
                    </CardFooter>
                )}
                {message && (
                    <Alert className="mt-4">
                        <AlertTitle>Notification</AlertTitle>
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                )}
            </Card>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {error && (
                <Alert className="mt-4">
                    <AlertTitle>Notification</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </>
    );
}
