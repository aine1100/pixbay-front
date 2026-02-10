import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "../services/booking.service";

export const useBookings = () => {
    return useQuery({
        queryKey: ["bookings"],
        queryFn: async () => {
            const response = await bookingService.getBookings();
            return response.data?.data || response.data || response;
        },
    });
};

export const useBookingDetails = (id: string) => {
    return useQuery({
        queryKey: ["booking", id],
        queryFn: async () => {
            const response = await bookingService.getBookingDetails(id);
            return response.data?.data || response.data || response;
        },
        enabled: !!id,
    });
};

export const useUpdateBookingStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            bookingService.updateBookingStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            queryClient.invalidateQueries({ queryKey: ["booking"] });
        },
    });
};
