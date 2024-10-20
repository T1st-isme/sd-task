import axiosInstance from './axiosConfig';

export const login = async (user: unknown) => {
    const response = await axiosInstance.post(`/auth/login`, user, {
        withCredentials: true,
    });
    return response.data;
};

export const register = async (user: unknown) => {
    const response = await axiosInstance.post(`/auth/signup`, user, {
        withCredentials: true,
    });
    return response.data;
};

export const forgotPassword = async (email: string) => {
    const response = await axiosInstance.post(`/user/request-password-reset`, { email });
    return response.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
    const response = await axiosInstance.post(`/user/reset-password?token=${token}`, { newPassword });
    return response.data;
};

export const enable2FA = async () => {
    const response = await axiosInstance.post(`/auth/enable-2fa`, {
        withCredentials: true,
    });
    return response.data;
};

export const verify2FA = async (code: string) => {
    const response = await axiosInstance.post(`/auth/verify-2fa`, { code }, {
        withCredentials: true,
    });
    return response.data;
};
