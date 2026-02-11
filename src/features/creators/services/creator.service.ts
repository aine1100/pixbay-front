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
    },

    async submitIdentity(data: { nationalId: string, country: string, idFront: File, idBack: File }) {
        const formData = new FormData();
        formData.append("nationalId", data.nationalId);
        formData.append("country", data.country);
        formData.append("idFront", data.idFront);
        formData.append("idBack", data.idBack);
        
        return api.post("/creators/activate/step1", formData);
    },

    async submitPortfolio(data: { links: string[], files: File[], title?: string, explanation?: string }) {
        const formData = new FormData();
        // Backend expects 'links[]' and 'portfolio' fields
        data.links.forEach((link, index) => {
             formData.append(`links[${index}]`, link);
        });
        data.files.forEach(file => {
            formData.append("portfolio", file);
        });

        if (data.title) formData.append("title", data.title);
        if (data.explanation) formData.append("explanation", data.explanation);
        
        return api.post("/creators/activate/step2", formData);
    },

    async submitEquipment(equipment: any[]) {
        // Map UI equipment to what backend expects (just array of strings or specific json)
        // Backend service.js expects an array of equipment names or objects
        return api.post("/creators/activate/step3", { equipment });
    },

    async updateProfile(data: any) {
        return api.patch("/creators/profile", data);
    }
};
