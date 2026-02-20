import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService } from "../services/job.service";

// ─── QUERIES ─────────────────────────────

export const useJobs = (filters?: { categoryId?: string; search?: string }) => {
    return useQuery({
        queryKey: ["jobs", filters],
        queryFn: async () => {
            const res = await jobService.getJobs(filters);
            return res.data || [];
        }
    });
};

export const useJob = (id: string) => {
    return useQuery({
        queryKey: ["job", id],
        queryFn: async () => {
            const res = await jobService.getJob(id);
            return res.data;
        },
        enabled: !!id
    });
};

export const useMyJobs = () => {
    return useQuery({
        queryKey: ["my-jobs"],
        queryFn: async () => {
            const res = await jobService.getMyJobs();
            return res.data || [];
        }
    });
};

export const useMyBids = () => {
    return useQuery({
        queryKey: ["my-bids"],
        queryFn: async () => {
            const res = await jobService.getMyBids();
            return res.data || [];
        }
    });
};

export const useJobBids = (jobId: string) => {
    return useQuery({
        queryKey: ["job-bids", jobId],
        queryFn: async () => {
            const res = await jobService.getBidsForJob(jobId);
            return res.data || [];
        },
        enabled: !!jobId
    });
};

// ─── MUTATIONS ───────────────────────────

export const useCreateJob = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: { title: string; description: string; budget?: number; location?: string; categoryId?: string; deadline?: string }) =>
            jobService.createJob(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["my-jobs"] });
            qc.invalidateQueries({ queryKey: ["jobs"] });
        }
    });
};

export const useUpdateJob = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
            jobService.updateJob(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["my-jobs"] });
            qc.invalidateQueries({ queryKey: ["jobs"] });
        }
    });
};

export const useDeleteJob = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => jobService.deleteJob(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["my-jobs"] });
            qc.invalidateQueries({ queryKey: ["jobs"] });
        }
    });
};

export const useSubmitBid = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ jobId, data }: { jobId: string; data: { amount: number; message: string } }) =>
            jobService.submitBid(jobId, data),
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: ["job-bids", vars.jobId] });
            qc.invalidateQueries({ queryKey: ["job", vars.jobId] });
            qc.invalidateQueries({ queryKey: ["my-bids"] });
            qc.invalidateQueries({ queryKey: ["jobs"] });
        }
    });
};

export const useAcceptBid = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (bidId: string) => jobService.acceptBid(bidId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["my-jobs"] });
            qc.invalidateQueries({ queryKey: ["jobs"] });
        }
    });
};

export const useRejectBid = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (bidId: string) => jobService.rejectBid(bidId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["my-jobs"] });
        }
    });
};

export const useWithdrawBid = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (bidId: string) => jobService.withdrawBid(bidId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["my-bids"] });
        }
    });
};
