import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supportService } from "../services/support.service";
import { toast } from "react-hot-toast";

export const useSubmitTicket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => supportService.submitTicket(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["supportTickets"] });
            toast.success("Support ticket submitted! We'll contact you soon.");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to submit ticket");
        }
    });
};

export const useMyTickets = () => {
    return useQuery({
        queryKey: ["supportTickets"],
        queryFn: supportService.getMyTickets
    });
};
