import { api } from "@/services/api";

export interface PaymentInitializationResponse {
    success: boolean;
    paymentLink: string;
}

export interface PaymentVerificationResponse {
    success: boolean;
    message: string;
    data: any;
}

export const paymentService = {
    /**
     * Initialize a payment for a booking
     * @param bookingId - The ID of the booking to pay for
     * @param details - Optional details like method and phone number
     * @returns - The payment link from Flutterwave
     */
    async initializePayment(bookingId: string, details?: any): Promise<any> {
        return await api.post("/payments/initialize", { bookingId, ...details });
    },

    /**
     * Verify a transaction manually
     * @param transactionId - The transaction ID from Flutterwave
     * @returns - Verification result
     */
    async verifyPayment(transactionId: string): Promise<any> {
        return await api.get(`/payments/verify`, {
            params: { transactionId }
        });
    },

    /**
     * Get payment history for the logged-in creator
     */
    async getCreatorPayments(): Promise<any> {
        return await api.get("/payments/creator/history");
    }
};
