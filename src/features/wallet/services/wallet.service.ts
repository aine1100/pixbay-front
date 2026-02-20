import { api } from "@/services/api";

export const walletService = {
    async getWalletBalance() {
        return api.get("/wallet/balance");
    },

    async updatePayoutSettings(data: { method: string; details: any }) {
        return api.patch("/wallet/payout-settings", data);
    }
};
