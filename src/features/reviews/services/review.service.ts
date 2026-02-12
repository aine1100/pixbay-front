import { api } from "@/services/api";

export const reviewService = {
    getCreatorReviews: async () => {
        return await api.request("/creators/reviews");
    }
};
