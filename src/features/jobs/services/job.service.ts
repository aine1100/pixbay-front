import { api } from "@/services/api";

export const jobService = {
    // ─── JOBS ────────────────────────────
    async getJobs(filters?: { categoryId?: string; status?: string; search?: string }) {
        const params = new URLSearchParams();
        if (filters?.categoryId) params.append("categoryId", filters.categoryId);
        if (filters?.status) params.append("status", filters.status);
        if (filters?.search) params.append("search", filters.search);
        const query = params.toString();
        return api.get(`/jobs${query ? `?${query}` : ""}`);
    },

    async getJob(id: string) {
        return api.get(`/jobs/${id}`);
    },

    async getMyJobs() {
        return api.get("/jobs/my-jobs");
    },

    async createJob(data: {
        title: string;
        description: string;
        budget?: number;
        location?: string;
        categoryId?: string;
        deadline?: string;
    }) {
        return api.post("/jobs", data);
    },

    async updateJob(id: string, data: Record<string, any>) {
        return api.put(`/jobs/${id}`, data);
    },

    async deleteJob(id: string) {
        return api.delete(`/jobs/${id}`);
    },

    // ─── BIDS ────────────────────────────
    async getBidsForJob(jobId: string) {
        return api.get(`/jobs/${jobId}/bids`);
    },

    async submitBid(jobId: string, data: { amount: number; message: string; portfolio?: any }) {
        return api.post(`/jobs/${jobId}/bids`, data);
    },

    async getMyBids() {
        return api.get("/jobs/bids/my-bids");
    },

    async updateBid(bidId: string, data: { amount?: number; message?: string }) {
        return api.put(`/jobs/bids/${bidId}`, data);
    },

    async withdrawBid(bidId: string) {
        return api.put(`/jobs/bids/${bidId}/withdraw`, {});
    },

    async acceptBid(bidId: string) {
        return api.put(`/jobs/bids/${bidId}/accept`, {});
    },

    async rejectBid(bidId: string) {
        return api.put(`/jobs/bids/${bidId}/reject`, {});
    },
};
