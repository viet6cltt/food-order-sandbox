import api from "../../services/apiClient";

export type LoginPayload = {
    phone: string;
    password: string;
};

export type RegisterPayload = {
    username: string;
    password: string;
    idToken: string; // Firebase ID Token
};

export type LoginResponse = {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        user: {
            id: string;
            username: string;
            phone: string;
        };
    };
};

export type RegisterResponse = {
    success?: boolean;
    message?: string;
    data?: {
        user: {
            id: string;
            username: string;
            phone: string;
        };
    };
    user?: {
        _id: string;
        username: string;
        phone: string;
    };
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const res = await api.post('/auth/login', payload);
    return res.data;
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
    const res = await api.post('/auth/register', payload);
    return res.data;
}
