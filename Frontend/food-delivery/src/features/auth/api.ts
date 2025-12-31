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
            role: string;
            avatarUrl: string;
            firstname: string;
            lastname: string;
            address: { street: string; city: string; geo: [number, number]};
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

export type OAuthUrlResponse = { 
    success?: boolean;
    message?: string;
    data?: {
        url: string;
    };
};

export async function getOAuthUrl(provider: "google", returnUrl: string) : Promise<OAuthUrlResponse> {
    const res = await api.get("/auth/oauth-url", {
        params: { provider, returnUrl }
    });

    return res.data;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const res = await api.post('/auth/login', payload);
    return res.data;
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
    const res = await api.post('/auth/register', payload);
    return res.data;
}

// =========== RESET PASSWORD =============
export type PasswordResetRequestPayload = {
    email: string;
};

export type PasswordResetRequestResponse = {
    success: boolean;
    message: string;
    data: object;
};

export type PasswordResetPayload = {
    token: string;
    newPassword: string;
};

export type PasswordResetResponse = {
    success: boolean;
    message: string;
    data: object;
};

export async function requestPasswordReset(payload: PasswordResetRequestPayload): Promise<PasswordResetRequestResponse> {
    const res = await api.post('/auth/password-reset-request', payload);
    return res.data;
}

export async function resetPassword(payload: PasswordResetPayload): Promise<PasswordResetResponse> {
    const res = await api.post('/auth/password-reset', payload);
    return res.data;
}
