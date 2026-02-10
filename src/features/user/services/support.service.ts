import { api } from "@/services/api";

export const supportService = {
    async submitTicket(data: { subject: string, message: string, priority?: string, name?: string, email?: string }) {
        const response = await api.post("/support", data);
        return response.data || response;
    },

    async getMyTickets() {
        const response = await api.get("/support/me");
        return response.data || response;
    }
};
