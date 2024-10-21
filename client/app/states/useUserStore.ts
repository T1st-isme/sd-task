import { create } from "zustand";
import { getUsers } from "../services/user.service";
import { User } from "../types/user";

interface UserStore {
    users: User[] | null;
    loading: boolean;
    error: string | null;
    setUsers: (users: User[] | null) => void;
    getUsers: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
    users: null,
    loading: false,
    error: null,
    setUsers: (users) => set({ users }),

    getUsers: async () => {
        set({ loading: true });
        try {
            const response = await getUsers();
            set({ users: response.data });
        } catch (error: unknown) {
            set({
                error: error instanceof Error ? error.message : "Unknown error",
            });
        } finally {
            set({ loading: false });
        }
    },
}));
