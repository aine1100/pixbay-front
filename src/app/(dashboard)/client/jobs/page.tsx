"use client";

import { useState } from "react";
import { useMyJobs, useCreateJob, useDeleteJob, useAcceptBid, useRejectBid } from "@/features/jobs/hooks/useJobs";
import { jobService } from "@/features/jobs/services/job.service";
import { Loading } from "@/components/ui/loading";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import NextImage from "next/image";
import {
    Plus, Briefcase, MapPin, Calendar, DollarSign, Users,
    MoreVertical, Eye, Trash2, ChevronRight, X, Clock,
    CheckCircle2, XCircle, MessageSquare, Star, ChevronDown
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PaymentModal } from "@/features/payment/components/PaymentModal";
import { paymentService } from "@/features/payment/services/payment.service";

const STATUS_COLORS: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-100",
    FILLED: "bg-blue-50 text-blue-600 border-blue-100",
    COMPLETED: "bg-slate-50 text-slate-600 border-slate-100",
    CANCELLED: "bg-red-50 text-red-600 border-red-100",
    PENDING: "bg-orange-50 text-orange-600 border-orange-100"
};

export default function ClientJobsPage() {
    const { data: jobs, isLoading, refetch } = useMyJobs();
    const createJob = useCreateJob();
    const deleteJobMut = useDeleteJob();
    const acceptBid = useAcceptBid();
    const rejectBid = useRejectBid();

    const [showCreate, setShowCreate] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [form, setForm] = useState({ title: "", description: "", budget: "", location: "", deadline: "" });
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // Fetch bids for the selected job
    const { data: bids, isLoading: bidsLoading } = useQuery({
        queryKey: ["job-bids", selectedJobId],
        queryFn: async () => {
            if (!selectedJobId) return [];
            const res = await jobService.getBidsForJob(selectedJobId);
            return res.data || [];
        },
        enabled: !!selectedJobId
    });

    const selectedJob = (jobs || []).find((j: any) => j.id === selectedJobId);

    const handleCreate = async () => {
        if (!form.title.trim() || !form.description.trim()) {
            toast.error("Title and description are required");
            return;
        }
        try {
            await createJob.mutateAsync({
                title: form.title,
                description: form.description,
                budget: form.budget ? parseFloat(form.budget) : undefined,
                location: form.location || undefined,
                deadline: form.deadline || undefined
            });
            toast.success("Job posted successfully!");
            setShowCreate(false);
            setForm({ title: "", description: "", budget: "", location: "", deadline: "" });
        } catch (err: any) {
            toast.error(err.message || "Failed to post job");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteJobMut.mutateAsync(id);
            toast.success("Job deleted");
            if (selectedJobId === id) setSelectedJobId(null);
        } catch (err: any) {
            toast.error(err.message || "Failed to delete");
        }
    };

    const handleAcceptBid = async (bidId: string) => {
        try {
            await acceptBid.mutateAsync(bidId);
            toast.success("Bid accepted! The creator has been notified.");
            refetch();
        } catch (err: any) {
            toast.error(err.message || "Failed to accept bid");
        }
    };

    const handleRejectBid = async (bidId: string) => {
        try {
            await rejectBid.mutateAsync(bidId);
            toast.success("Bid rejected");
            refetch();
        } catch (err: any) {
            toast.error(err.message || "Failed to reject bid");
        }
    };

    const initiatePayment = async (payload: any) => {
        if (!selectedJob?.booking?.id) return { success: false, message: "Booking not found" };
        try {
            const res = await paymentService.initializePayment(selectedJob.booking.id, payload);
            if (res.success) {
                const { data } = res;
                if (data.paymentLink) {
                    window.location.href = data.paymentLink;
                    return { success: true };
                }
                const authMode = data.meta?.authorization?.mode;
                if (authMode === 'pin') return { requiresPin: true, ...data };
                if (authMode === 'otp' || data.message === "Charge initiated") {
                    return { requiresOtp: true, flw_ref: data.data?.flw_ref || data.flw_ref, ...data };
                }
                if (data.status === "success" && data.message === "Charge successful") {
                    toast.success("Payment Successful!");
                    refetch();
                    setIsPaymentModalOpen(false);
                    return { success: true };
                }
                return data;
            }
            return { success: false, message: res.message };
        } catch (error: any) {
            toast.error(error.message || "Payment Failed");
            throw error;
        }
    };

    const handleOtpVerify = async (transId: string, otp: string) => {
        try {
            const res = await paymentService.validatePayment(transId, otp);
            if (res.success) {
                toast.success("Payment Successful!");
                refetch();
                setIsPaymentModalOpen(false);
                return { success: true };
            }
            return { success: false, message: res.message };
        } catch (error: any) {
            toast.error(error.message || "Verification failed");
            throw error;
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white rounded-[24px] border border-slate-100 min-h-[500px]">
                <Loading size="lg" />
                <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading your jobs...</p>
            </div>
        );
    }

    return (
        <div className="flex bg-[#FAFBFC] h-[calc(100vh-80px)] overflow-hidden font-sans p-6 gap-6">

            {/* Left Panel — Job List */}
            <div className="flex-1 flex flex-col gap-6 max-w-[650px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">My Jobs</h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">{(jobs || []).length} job{(jobs || []).length !== 1 ? "s" : ""} posted</p>
                    </div>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 px-5 h-11 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Post Job
                    </button>
                </div>

                {/* Job Cards */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {(jobs || []).length > 0 ? (
                        (jobs || []).map((job: any) => (
                            <button
                                key={job.id}
                                onClick={() => setSelectedJobId(job.id)}
                                className={cn(
                                    "w-full text-left bg-white p-6 rounded-[24px] border border-slate-100 transition-all group hover:border-slate-200",
                                    selectedJobId === job.id && "border-primary/20 bg-primary/[0.02]"
                                )}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-base font-semibold text-slate-900 line-clamp-1 pr-4">{job.title}</h3>
                                    <span className={cn(
                                        "px-3 py-1 rounded-lg text-[12px] font-semibold border shrink-0",
                                        STATUS_COLORS[job.status] || STATUS_COLORS.PENDING
                                    )}>
                                        {job.status}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-4">{job.description}</p>
                                <div className="flex items-center gap-4 text-[12px] font-medium text-slate-500">
                                    {job.budget && (
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="w-3.5 h-3.5" />
                                            RWF {parseFloat(job.budget).toLocaleString()}
                                        </span>
                                    )}
                                    {job.location && (
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {job.location}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3.5 h-3.5" />
                                        {job._count?.bids || 0} bids
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    </span>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-[24px] border border-slate-50 border-dashed">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                <Briefcase className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-base font-semibold text-slate-900 mb-1">No jobs yet</h3>
                            <p className="text-sm font-medium text-slate-400 max-w-[250px]">
                                Post your first job and let creators come to you with proposals.
                            </p>
                            <button
                                onClick={() => setShowCreate(true)}
                                className="mt-6 flex items-center gap-2 px-5 h-10 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Post Your First Job
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel — Job Detail + Bids */}
            <div className="w-[480px] bg-white rounded-[32px] border border-slate-100 flex flex-col overflow-hidden">
                {selectedJob ? (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Job Header */}
                        <div className="p-8 pb-6 border-b border-slate-50">
                            <div className="flex items-start justify-between mb-3">
                                <h2 className="text-lg font-semibold text-slate-900 tracking-tight pr-4">{selectedJob.title}</h2>
                                <button
                                    onClick={() => handleDelete(selectedJob.id)}
                                    className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-sm text-slate-500 font-medium mb-4 leading-relaxed">{selectedJob.description}</p>
                            <div className="flex flex-wrap gap-3">
                                {selectedJob.budget && (
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-semibold border border-emerald-100">
                                        <DollarSign className="w-3.5 h-3.5" />
                                        RWF {parseFloat(selectedJob.budget).toLocaleString()}
                                    </span>
                                )}
                                {selectedJob.location && (
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold border border-blue-100">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {selectedJob.location}
                                    </span>
                                )}
                                {selectedJob.deadline && (
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-semibold border border-orange-100">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(selectedJob.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </span>
                                )}
                                <span className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-semibold border",
                                    STATUS_COLORS[selectedJob.status] || STATUS_COLORS.PENDING
                                )}>
                                    {selectedJob.status}
                                </span>
                            </div>

                            {/* Payment Action for Filled Jobs */}
                            {selectedJob.status === "FILLED" && selectedJob.booking?.paymentStatus === "PENDING" && (
                                <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">Proposal Accepted!</p>
                                            <p className="text-xs text-slate-500 font-medium">Fund the escrow to start the project.</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-900">RWF {parseFloat(selectedJob.booking.pricing.totalAmount).toLocaleString()}</p>
                                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total amount</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsPaymentModalOpen(true)}
                                        className="w-full h-11 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        <DollarSign className="w-4 h-4" />
                                        Proceed to Payment
                                    </button>
                                </div>
                            )}

                            {selectedJob.status === "FILLED" && selectedJob.booking?.paymentStatus === "PAID_IN_ESCROW" && (
                                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm shadow-emerald-200">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-emerald-900">Payment Secured</p>
                                        <p className="text-xs text-emerald-600 font-medium font-sans">Funds are held in escrow. Work has started!</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bids List */}
                        <div className="flex-1 overflow-y-auto p-8 pt-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-[14px] font-semibold text-slate-400 uppercase tracking-widest">
                                    Proposals ({bids?.length || 0})
                                </h3>
                            </div>
                            {bidsLoading ? (
                                <div className="flex justify-center py-10"><Loading size="md" /></div>
                            ) : (bids || []).length > 0 ? (
                                <div className="space-y-4">
                                    {(bids || []).map((bid: any) => (
                                        <div key={bid.id} className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 hover:border-slate-200 transition-all">
                                            {/* Creator Info */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                                                    {bid.creator?.user?.profilePicture ? (
                                                        <NextImage src={bid.creator.user.profilePicture} alt="" fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-sm font-bold text-slate-400">
                                                            {bid.creator?.user?.firstName?.[0] || "C"}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                                                        {bid.creator?.user?.firstName} {bid.creator?.user?.lastName}
                                                    </h4>
                                                    <p className="text-[11px] text-slate-500 font-medium">{bid.creator?.user?.city || "Remote"}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-bold text-slate-900">RWF {parseFloat(bid.amount).toLocaleString()}</span>
                                                    <p className="text-[10px] text-slate-400 font-medium">Proposed price</p>
                                                </div>
                                            </div>

                                            {/* Bid Message */}
                                            <p className="text-sm text-slate-600 font-medium leading-relaxed mb-4 line-clamp-3">{bid.message}</p>

                                            {/* Bid Status / Actions */}
                                            {bid.status === "PENDING" && selectedJob.status === "ACTIVE" ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleAcceptBid(bid.id)}
                                                        className="flex-1 flex items-center justify-center gap-2 h-9 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-all"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectBid(bid.id)}
                                                        className="flex-1 flex items-center justify-center gap-2 h-9 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className={cn(
                                                    "inline-block px-3 py-1 rounded-lg text-[11px] font-semibold border",
                                                    bid.status === "ACCEPTED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                    bid.status === "REJECTED" ? "bg-red-50 text-red-500 border-red-100" :
                                                    "bg-slate-50 text-slate-500 border-slate-100"
                                                )}>
                                                    {bid.status}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-3">
                                        <Users className="w-7 h-7 text-slate-300" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-700 mb-1">No proposals yet</h4>
                                    <p className="text-xs text-slate-400 font-medium max-w-[200px]">
                                        Creators will submit proposals once they see your job posting.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                            <Briefcase className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 mb-2">Select a job</h3>
                        <p className="text-sm font-medium text-slate-500 max-w-[200px]">
                            Click on a job from the list to view details and proposals.
                        </p>
                    </div>
                )}
            </div>

            {/* Create Job Modal */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-semibold text-slate-900">Post a New Job</h2>
                            <button onClick={() => setShowCreate(false)} className="p-2 rounded-xl hover:bg-slate-100 transition-all">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title *</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="e.g. Wedding Photographer Needed"
                                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Describe what you need, the style, number of hours, etc."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Budget (RWF)</label>
                                    <input
                                        type="number"
                                        value={form.budget}
                                        onChange={(e) => setForm({ ...form, budget: e.target.value })}
                                        placeholder="50,000"
                                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={form.location}
                                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                                        placeholder="Kigali"
                                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Deadline</label>
                                <input
                                    type="date"
                                    value={form.deadline}
                                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowCreate(false)}
                                className="flex-1 h-12 bg-slate-100 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={createJob.isPending}
                                className="flex-1 h-12 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
                            >
                                {createJob.isPending ? <Loading size="sm" /> : "Post Job"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Payment Modal */}
            {selectedJob?.booking && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    bookingDetails={{
                        id: selectedJob.booking.id,
                        amount: parseFloat(selectedJob.booking.pricing.totalAmount),
                        currency: selectedJob.booking.pricing.currency || "KES",
                        type: "PROJECT_BASED"
                    }}
                    onPaymentInitiate={initiatePayment}
                    onOtpVerify={handleOtpVerify}
                />
            )}
        </div>
    );
}
