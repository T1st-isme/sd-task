"use client";

import { useAuthStore } from "../states/useAuthStore";

export const useAuth = () => {
    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);
    const error = useAuthStore((state) => state.error);
    const message = useAuthStore((state) => state.message);
    const qrCodeDataURL = useAuthStore((state) => state.qrCodeDataURL);
    const twoFactorSecret = useAuthStore((state) => state.twoFactorSecret);
    const login = useAuthStore((state) => state.login);
    const register = useAuthStore((state) => state.register);
    const logout = useAuthStore((state) => state.logout);
    const forgotPassword = useAuthStore((state) => state.forgotPassword);
    const resetPassword = useAuthStore((state) => state.resetPassword);
    const enable2FA = useAuthStore((state) => state.enable2FA);
    const verify2FA = useAuthStore((state) => state.verify2FA);
    // const checkAuth = useAuthStore((state) => state.checkAuth);
    // const hasRole = useAuthStore((state) => state.hasRole);

    return { user, loading, error, message, login, register, logout, forgotPassword, resetPassword, enable2FA, qrCodeDataURL, twoFactorSecret, verify2FA };
};
