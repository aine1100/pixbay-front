import { useQuery } from "@tanstack/react-query";
import { reviewService } from "../services/review.service";

export const useCreatorReviews = () => {
    return useQuery({
        queryKey: ["creator-reviews"],
        queryFn: async () => {
            const response = await reviewService.getCreatorReviews();
            return response.data || [];
        }
    });
};
