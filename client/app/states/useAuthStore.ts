import { create } from "zustand";
import {
    enable2FA,
    forgotPassword,
    login,
    register,
    resetPassword,
    verify2FA,
} from "../services/auth.service";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { User } from "../types/user";

interface AuthState {
    user: User | null;
    loading: boolean;
    message: string | null;
    error: string | null;
    twoFactorRequired: boolean;
    qrCodeDataURL: string | null;
    twoFactorSecret: string | null;
    enable2FA: () => Promise<void>;
    register: (
        username: string,
        email: string,
        password: string,
        confirmPassword: string
    ) => Promise<void>;
    login: (
        identifier: string,
        password: string,
        twoFactorCode?: string
    ) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    hasRole: (role: string) => boolean;
    verify2FA: (code: string) => Promise<void>;
}

const isTokenExpired = (token: string): boolean => {
    try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        return exp * 1000 < Date.now();
    } catch (error) {
        console.error("Error decoding token:", error);
        return true;
    }
};

// decode the JWT
const decodeToken = (token: string): User => {
    try {
        return jwtDecode<User>(token);
    } catch (error) {
        console.error("Error decoding token:", error);
        return {} as User;
    }
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: false,
    message: null,
    error: null,
    twoFactorRequired: true,
    qrCodeDataURL: null,
    twoFactorSecret: null,

    register: async (username, email, password, confirmPassword) => {
        set({ loading: true, error: null });
        try {
            const response = await register({
                username,
                email,
                password,
                confirmPassword,
            });
            console.log("response", response);
            set({ user: response.user, loading: false, message: response.message });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Registration failed",
                loading: false,
            });
        }
    },

    login: async (identifier, password, twoFactorCode) => {
        set({ loading: true, error: null });
        try {
            const response = await login({
                identifier,
                password,
                twoFactorCode,
            });
            if (response.message === "Login successful") {
                // Decode the token to get user data
                const decodedUser = decodeToken(response.token);
                console.log("Decoded User from Token:", decodedUser);
                set({
                    user: decodedUser,
                    loading: false,
                    message: response.message,
                });
            } else if (
                response.status === 401 &&
                response.message === "2FA code required"
            ) {
                set({ twoFactorRequired: true, message: response.message });
            } else {
                set({
                    user: response,
                    loading: false,
                    message: response.message,
                });
            }
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Login failed",
                loading: false,
            });
        }
    },

    forgotPassword: async (email) => {
        set({ loading: true, error: null });
        try {
            await forgotPassword(email);
            set({ loading: false, message: "Email sent" });
        } catch (error: any) {
            set({
                error: error.response?.message || "Forgot password failed",
                loading: false,
            });
        }
    },

    resetPassword: async (token: string, newPassword: string) => {
        set({ loading: true, error: null });
        try {
            await resetPassword(token, newPassword);
            set({ loading: false, message: "Password reset successful" });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Reset password failed",
                loading: false,
            });
        }
    },

    logout: () => {
        Cookies.remove("jwt");
        set({ user: null, loading: false, message: "Logout successful" });
    },

    checkAuth: async () => {
        const token = Cookies.get("jwt");

        if (token) {
            if (isTokenExpired(token)) {
                console.warn("Token expired, logging out");
                Cookies.remove("jwt");
                set({ user: null, error: "Session expired" });
                return;
            }

            try {
                // Decode the token to retrieve user information
                const decodedUser = decodeToken(token);

                console.log("Decoded User from CheckAuth:", decodedUser);

                set({ user: decodedUser, loading: false });
            } catch (error) {
                console.error("Error decoding token:", error);
                set({ error: "Invalid token", user: null });
                Cookies.remove("jwt");
            }
        } else {
            console.log("No token found");
            set({ user: null });
        }
    },

    hasRole: (role: string): boolean => {
        const state = useAuthStore.getState();
        return state.user?.roles?.includes(role) ?? false;
    },

    enable2FA: async () => {
        set({ loading: true, error: null });
        try {
            const response = await enable2FA();
            set({
                qrCodeDataURL: response.qrCodeDataURL,
                twoFactorSecret: response.twoFactorSecret,
                loading: false,
                message: "2FA enabled",
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Enable 2FA failed",
                loading: false,
            });
        }
    },

    verify2FA: async (code: string) => {
        set({ loading: true, error: null });
        try {
            await verify2FA(code);
            set({ loading: false, message: "2FA verified" });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Verify 2FA failed",
                loading: false,
            });
        }
    },
}));
