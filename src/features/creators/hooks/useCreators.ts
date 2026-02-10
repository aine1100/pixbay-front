import { useQuery } from "@tanstack/react-query";
import { creatorService, CreatorFilter } from "../services/creator.service";

export const useCreators = (filters: CreatorFilter = {}) => {
    return useQuery({
        queryKey: ["creators", filters],
        queryFn: async () => {
            const response = await creatorService.getCreators(filters);
            // Handle both direct data and nested response
            return response.data || response;
        },
    });
};

export const useCreatorProfile = (id: string) => {
    return useQuery({
        queryKey: ["creator", id],
        queryFn: async () => {
            const response = await creatorService.getCreatorProfile(id);
            return response.data || response;
        },
        enabled: !!id,
    });
};
