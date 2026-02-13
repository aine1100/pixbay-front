import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../services/review.service";
import { toast } from "react-hot-toast";

export const useCreatorReviews = () => {
    return useQuery({
        queryKey: ["creator-reviews"],
        queryFn: async () => {
            const response = await reviewService.getCreatorReviews();
            return response.data || [];
        }
    });
};

export const useCreateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewData: { bookingId: string; rating: number; comment: string }) =>
            reviewService.createReview(reviewData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["creator-reviews"] });
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            toast.success("Review submitted! Thank you for your feedback.");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to submit review");
        }
    });
};
