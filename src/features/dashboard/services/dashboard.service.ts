import { api } from "@/services/api";

export const dashboardService = {
    async getStats(month?: number, year?: number) {
        const queryParams = new URLSearchParams();
        if (month) queryParams.append("month", month.toString());
        if (year) queryParams.append("year", year.toString());

        const queryString = queryParams.toString();
        const url = `/dashboard/stats${queryString ? `?${queryString}` : ""}`;

        return api.get(url);
    }
};
