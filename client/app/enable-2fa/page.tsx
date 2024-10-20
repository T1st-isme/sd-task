import EnableTwoFactorAuth from "@/components/enable-2fa";
import AuthLayout from "../authLayout";
import MainLayout from "../MainLayout";

export default function Enable2FA() {
    return (
        <AuthLayout requiredRoles={["user"]}>
            <MainLayout title="Enable 2FA">
                <EnableTwoFactorAuth />
            </MainLayout>
        </AuthLayout>
    );
}
