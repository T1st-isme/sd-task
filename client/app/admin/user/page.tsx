import React from "react";
import UserTable from "@/components/userTable";
import AuthLayout from "@/app/authLayout";
import MainLayout from "@/app/MainLayout";

const UserTablePage: React.FC = () => {
    return (
        <AuthLayout requiredRoles={["admin"]}>
            <MainLayout title="User List">
                <UserTable />
            </MainLayout>
        </AuthLayout>
    );
};

export default UserTablePage;
