"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./states/useAuthStore";
import { Loader2 } from "lucide-react";

interface AuthLayoutProps {
    children: React.ReactNode;
    requiredRoles?: string[];
}

export default function AuthLayout({
    children,
    requiredRoles = [],
}: AuthLayoutProps) {
    const { user, loading, checkAuth, hasRole } = useAuthStore();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const verifyAuth = async () => {
            if (!user) {
                await checkAuth();
            }

            const currentUser = useAuthStore.getState().user;
            if (!currentUser) {
                router.replace("/login");
            } else if (
                requiredRoles.length > 0 &&
                !requiredRoles.some((role) => hasRole(role))
            ) {
                router.replace("/404");
            } else {
                setIsAuthorized(true);
            }
        };

        verifyAuth();
    }, [user, checkAuth, router, hasRole, requiredRoles]);

    if (loading || !isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return <>{children}</>;
}
