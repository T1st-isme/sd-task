import axiosInstance from './axiosConfig';

export const getUsers = async () => {
    const response = await axiosInstance.get("/user");
    return response.data;
};
