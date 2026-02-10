import { api } from "@/services/api";

export const userService = {
    async getMe() {
        const response = await api.get("/users/me");
        return response.data || response;
    },

    async updateProfile(data: any) {
        const response = await api.put("/users/me", data);
        return response.data || response;
    },

    async getSessions(page = 1, limit = 5) {
        const response = await api.get(`/users/me/sessions?page=${page}&limit=${limit}`);
        return response;
    },

    async revokeSession(sessionId: string) {
        const response = await api.delete(`/users/me/sessions/${sessionId}`);
        return response.data || response;
    }
};
