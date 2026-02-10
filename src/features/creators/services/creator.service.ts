import { api } from "@/services/api";

export interface CreatorFilter {
    type?: string;
    city?: string;
    country?: string;
}

export const creatorService = {
    async getCreators(filters: CreatorFilter = {}) {
        const queryParams = new URLSearchParams();
        if (filters.type) queryParams.append("type", filters.type);
        if (filters.city) queryParams.append("city", filters.city);
        if (filters.country) queryParams.append("country", filters.country);

        const queryString = queryParams.toString();
        const url = `/creators${queryString ? `?${queryString}` : ""}`;
        
        return api.get(url);
    },

    async getCreatorProfile(id: string) {
        return api.get(`/creators/profile/${id}`);
    }
};
