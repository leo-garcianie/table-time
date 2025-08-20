import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
});

// Add token
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// AUTH
export const onRegister = async (data) => {
    return await axiosInstance.post("/auth/register", data);
};

export const onLogin = async (data) => {
    return await axiosInstance.post("/auth/login", data);
};

export const getProfile = async () => {
    return await axiosInstance.get("/auth/profile");
};

// TABLES
export const getTables = async () => {
    return await axiosInstance.get("/tables");
};

export const postTable = async (data) => {
    return await axiosInstance.post("/tables", data);
};

// AVAILABILITY
export const getAvailability = async (params) => {
    return await axiosInstance.get("/availability", { params });
};

// RESERVATIONS
export const getReservations = async (params) => {
    return await axiosInstance.get("/reservations", { params });
};

export const postReservation = async (data) => {
    return await axiosInstance.post("/reservations", data);
};

export const getReservation = async (id) => {
    return await axiosInstance.get(`/reservations/${id}`);
};

export const cancelReservation = async (id) => {
    return await axiosInstance.patch(`/reservations/${id}/cancel`);
};

export const myReservations = async () => {
    return await axiosInstance.get("/reservations/my/reservations");
};

// DASHBOARD
export const getStats = async () => {
    return await axiosInstance.get("/dashboard/stats");
};
