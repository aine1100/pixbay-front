import { api } from "@/services/api";

export interface BookingDetails {
    // Add specific booking details interface if needed
    [key: string]: any;
}

export const bookingService = {
    async getBookings() {
        return api.get("/bookings");
    },

    async getBookingDetails(id: string) {
        return api.get(`/bookings/${id}`);
    },

    async createBooking(data: { creatorId: string; serviceType: string; category: string; bookingDetails: any; pricing: any }) {
        return api.post("/bookings", data);
    },

    async updateBookingStatus(id: string, status: string) {
        return api.patch(`/bookings/${id}/status`, { status });
    },

    async deleteBooking(id: string) {
        return api.delete(`/bookings/${id}`);
    },

    async registerCheckIn(id: string, sessionNumber: number, location: { latitude: number; longitude: number }) {
        return api.post(`/bookings/${id}/check-in`, { sessionNumber, location });
    },

    async uploadProjectMedia(id: string, data: { files?: File[]; links?: string[] }) {
        const formData = new FormData();
        
        if (data.files) {
            data.files.forEach(file => {
                formData.append("delivery", file);
            });
        }

        if (data.links) {
            data.links.forEach(link => {
                formData.append("links", link);
            });
        }

        return api.post(`/bookings/${id}/delivery`, formData);
    },

    async confirmDelivery(id: string) {
        return api.post(`/bookings/${id}/confirm-delivery`, {});
    }
};
