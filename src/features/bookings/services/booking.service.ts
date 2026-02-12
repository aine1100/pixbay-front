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
    }
};
