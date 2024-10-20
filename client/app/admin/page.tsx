// app/admin/page.tsx
import AuthLayout from "@/app/authLayout";
import MainLayout from "@/app/MainLayout";

export default function AdminPage() {
    const breadcrumbs = [
        { label: "Home", href: "/admin" },
        { label: "Employee" },
    ];

    return (
        <AuthLayout requiredRoles={["admin"]}>
            <MainLayout title="Admin" breadcrumbs={breadcrumbs}>
                AdminPage
            </MainLayout>
        </AuthLayout>
    );
}
