import { api } from "@/services/api";
import { LoginFormData } from "../schemas/login.schema";
import { RegisterFormData } from "../schemas/register.schema";
import { authStorage } from "@/lib/auth-storage";

export const authService = {
    async login(data: LoginFormData) {
        const response = await api.post("/auth/login", data);
        const authData = response.data || response; // Handle both direct and nested response
        if (authData.accessToken && authData.refreshToken) {
            authStorage.setTokens(authData.accessToken, authData.refreshToken);
        }
        return response;
    },

    async logout() {
        authStorage.clearTokens();
    },

    async register(data: RegisterFormData) {
        // Map frontend role to backend role (Prisma enum is uppercase)
        const { confirmPassword: _, agreeTerms: __, ...submitData } = data;
        const backendData = {
            ...submitData,
            role: data.role.toUpperCase(),
        };
        return api.post("/auth/register", backendData);
    },

    async verifyOtp(email: string, otp: string) {
        return api.post("/auth/verify-otp", { email, otp });
    },

    async forgotPassword(email: string) {
        return api.post("/auth/forgot-password", { email });
    },

    async resetPassword(data: { email: string; otp: string; newPassword: string }) {
        return api.post("/auth/reset-password", data);
    },

    async refreshToken(token: string) {
        return api.post("/auth/refresh-token", { refreshToken: token });
    },
};
