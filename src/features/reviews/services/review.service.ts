import { api } from "@/services/api";

export const reviewService = {
    getCreatorReviews: async () => {
        return await api.request("/creators/reviews");
    },
    createReview: async (reviewData: { bookingId: string, rating: number, comment: string }) => {
        return await api.request("/reviews", {
            method: "POST",
            body: JSON.stringify(reviewData)
        });
    }
};
