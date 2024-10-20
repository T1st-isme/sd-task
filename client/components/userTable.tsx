"use client";
import React, { useEffect } from "react";
import { useUsers } from "@/app/hooks/useUser";
import {
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    TableHeader,
} from "./ui/table";
import { Loader2 } from "lucide-react";

const UserTable: React.FC = () => {
    const { users, loading, error, getUsers } = useUsers();

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users?.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">
                                {user.username}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                {user.userRoles?.map((role) => role.role.name)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {loading && <Loader2 className="animate-spin" />}
            {error && <div className="text-red-500">Error: {error}</div>}
        </>
    );
};

export default UserTable;
