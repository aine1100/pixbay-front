import { api } from "@/services/api";

export const notificationService = {
    async getMyNotifications(params?: { limit?: number, offset?: number }) {
        const response = await api.get("/notifications", { params });
        return response.data;
    },

    async markAsRead(id: string) {
        const response = await api.patch(`/notifications/${id}/read`, {});
        return response.data;
    },

    async markAllRead() {
        const response = await api.patch("/notifications/read-all", {});
        return response.data;
    },

    async archiveNotification(id: string) {
        const response = await api.patch(`/notifications/${id}/archive`, {});
        return response.data;
    },

    async deleteNotification(id: string) {
        const response = await api.delete(`/notifications/${id}`);
        return response.data;
    }
};
