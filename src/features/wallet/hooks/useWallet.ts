import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletService } from "../services/wallet.service";

export const useWallet = () => {
    return useQuery({
        queryKey: ["wallet"],
        queryFn: async () => {
            const response = await walletService.getWalletBalance();
            return response.data?.data || response.data || response;
        }
    });
};

export const useUpdatePayoutSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { method: string; details: any }) =>
            walletService.updatePayoutSettings(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
        }
    });
};
