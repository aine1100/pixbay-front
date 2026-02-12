import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";

export const useDashboardStats = (month?: number, year?: number) => {
    return useQuery({
        queryKey: ["dashboard-stats", month, year],
        queryFn: async () => {
            const response = await dashboardService.getStats(month, year);
            return response.data?.data || response.data || response;
        }
    });
};
