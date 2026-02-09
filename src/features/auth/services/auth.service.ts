import { api } from "@/services/api";
import { LoginFormData } from "../schemas/login.schema";
import { RegisterFormData } from "../schemas/register.schema";

export const authService = {
    async login(data: LoginFormData) {
        return api.post("/auth/login", data);
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
};
