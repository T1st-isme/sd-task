import { Suspense } from "react";
import AuthPages from "@/components/auth-pages";

export default function AuthPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthPages />
        </Suspense>
    );
}
