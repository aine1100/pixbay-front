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

    async updateBookingStatus(id: string, status: string) {
        return api.patch(`/bookings/${id}/status`, { status });
    },

    async deleteBooking(id: string) {
        return api.delete(`/bookings/${id}`);
    }
};
