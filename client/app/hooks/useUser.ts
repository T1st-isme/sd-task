"use client";

import { useUserStore } from "../states/useUserStore";

export const useUsers = () => {
    const users = useUserStore((state) => state.users);
    const loading = useUserStore((state) => state.loading);
    const error = useUserStore((state) => state.error);
    const getUsers = useUserStore((state) => state.getUsers);


    return { users, loading, error, getUsers };
};
