// Template file -> fix to finish

import api from "../../services/apiClient";

export type LoginPayload = {
    email: string;
    password: string;
};

export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
    role?: 'customer' | 'owner';
};

export async function login(payload: LoginPayload) {
    const res = await api.post('/api/login', payload);
    return res.data;
}

export async function register(payload: RegisterPayload) {
    const res = await api.post('/api/register', payload);
    return res.data;
}
