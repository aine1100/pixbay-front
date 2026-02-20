"use client";

import { useState } from "react";
import { useJobs, useMyBids, useSubmitBid, useWithdrawBid } from "@/features/jobs/hooks/useJobs";
import { Loading } from "@/components/ui/loading";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import NextImage from "next/image";
import {
    Briefcase, MapPin, Calendar, DollarSign, Users,
    Search, X, Clock, Send, Eye, ArrowLeft,
    CheckCircle2, XCircle, ChevronDown,
    Wallet
} from "lucide-react";

const TABS = ["Browse Jobs", "My Bids"];

export default function CreatorJobsPage() {
    const [activeTab, setActiveTab] = useState("Browse Jobs");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [showBidModal, setShowBidModal] = useState(false);
    const [bidForm, setBidForm] = useState({ amount: "", message: "" });

    const { data: jobs, isLoading: jobsLoading } = useJobs({ search: searchQuery || undefined });
    const { data: myBids, isLoading: bidsLoading } = useMyBids();
    const submitBid = useSubmitBid();
    const withdrawBid = useWithdrawBid();

    const selectedJob = (jobs || []).find((j: any) => j.id === selectedJobId);

    const handleSubmitBid = async () => {
        if (!selectedJobId || !bidForm.amount || !bidForm.message.trim()) {
            toast.error("Please fill in your proposed price and message");
            return;
        }
        try {
            await submitBid.mutateAsync({
                jobId: selectedJobId,
                data: { amount: parseFloat(bidForm.amount), message: bidForm.message }
            });
            toast.success("Proposal submitted successfully!");
            setShowBidModal(false);
            setBidForm({ amount: "", message: "" });
        } catch (err: any) {
            toast.error(err.message || "Failed to submit proposal");
        }
    };

    const handleWithdraw = async (bidId: string) => {
        try {
            await withdrawBid.mutateAsync(bidId);
            toast.success("Bid withdrawn");
        } catch (err: any) {
            toast.error(err.message || "Failed to withdraw bid");
        }
    };

    const STATUS_BADGE: Record<string, string> = {
        PENDING: "bg-orange-50 text-orange-600 border-orange-100",
        ACCEPTED: "bg-emerald-50 text-emerald-600 border-emerald-100",
        REJECTED: "bg-red-50 text-red-500 border-red-100",
        WITHDRAWN: "bg-slate-50 text-slate-500 border-slate-100"
    };

    return (
        <div className="flex bg-[#FAFBFC] h-[calc(100vh-80px)] overflow-hidden font-sans p-6 gap-6">

            {/* Left Panel */}
            <div className="flex-1 flex flex-col gap-6 max-w-[650px]">
                {/* Header */}
                <div className="space-y-5">
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Jobs Board</h1>

                    {/* Tabs */}
                    <div className="flex gap-2 bg-white p-1 rounded-xl w-fit border border-slate-100">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setSelectedJobId(null); }}
                                className={cn(
                                    "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all",
                                    activeTab === tab
                                        ? "bg-primary text-white"
                                        : "text-slate-500 hover:text-slate-900"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Search (Browse tab only) */}
                    {activeTab === "Browse Jobs" && (
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search jobs by title or description..."
                                className="w-full h-11 pl-11 pr-4 bg-white border border-slate-100 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {activeTab === "Browse Jobs" ? (
                        // ─── BROWSE JOBS ─────────────
                        jobsLoading ? (
                            <div className="flex justify-center py-16"><Loading size="lg" /></div>
                        ) : (jobs || []).length > 0 ? (
                            (jobs || []).map((job: any) => (
                                <button
                                    key={job.id}
                                    onClick={() => setSelectedJobId(job.id)}
                                    className={cn(
                                        "w-full text-left bg-white p-6 rounded-[24px] border border-slate-100 transition-all group hover:border-slate-200",
                                        selectedJobId === job.id && "border-primary/20 bg-primary/[0.02]"
                                    )}
                                >
                                    {/* Client Info */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                                            {job.client?.profilePicture ? (
                                                <NextImage src={job.client.profilePicture} alt="" fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
                                                    {job.client?.firstName?.[0] || "C"}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs font-medium text-slate-500">
                                            {job.client?.firstName} {job.client?.lastName} · {job.client?.city || "Remote"}
                                        </span>
                                    </div>

                                    <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-1">{job.title}</h3>
                                    <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-4">{job.description}</p>

                                    <div className="flex items-center gap-4 text-[12px] font-medium text-slate-500">
                                        {job.budget && (
                                            <span className="flex items-center gap-1 text-emerald-600">
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
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[24px] border border-slate-50 border-dashed">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                    <Briefcase className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-base font-semibold text-slate-900 mb-1">No jobs available</h3>
                                <p className="text-sm text-slate-400 font-medium">Check back later for new opportunities.</p>
                            </div>
                        )
                    ) : (
                        // ─── MY BIDS ─────────────
                        bidsLoading ? (
                            <div className="flex justify-center py-16"><Loading size="lg" /></div>
                        ) : (myBids || []).length > 0 ? (
                            (myBids || []).map((bid: any) => (
                                <div
                                    key={bid.id}
                                    className="bg-white p-6 rounded-[24px] border border-slate-100 hover:border-slate-200 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-base font-semibold text-slate-900 line-clamp-1 pr-4">{bid.job?.title}</h3>
                                        <span className={cn(
                                            "px-3 py-1 rounded-lg text-[12px] font-semibold border shrink-0",
                                            STATUS_BADGE[bid.status] || STATUS_BADGE.PENDING
                                        )}>
                                            {bid.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium line-clamp-1 mb-3">{bid.job?.description}</p>

                                    <div className="flex items-center gap-4 text-[12px] font-medium text-slate-500 mb-4">
                                        <span className="text-emerald-600 font-semibold">
                                            Your bid: RWF {parseFloat(bid.amount).toLocaleString()}
                                        </span>
                                        {bid.job?.budget && (
                                            <span>Budget: RWF {parseFloat(bid.job.budget).toLocaleString()}</span>
                                        )}
                                        <span>{bid.job?._count?.bids || 0} total bids</span>
                                    </div>

                                    {bid.status === "PENDING" && (
                                        <button
                                            onClick={() => handleWithdraw(bid.id)}
                                            className="text-sm text-red-500 font-semibold hover:text-red-600 transition-all"
                                        >
                                            Withdraw Bid
                                        </button>
                                    )}
                                    {bid.status === "ACCEPTED" && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-emerald-600">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span className="text-sm font-semibold">Your proposal was accepted!</span>
                                            </div>
                                            {bid.job?.booking?.paymentStatus === "PENDING" ? (
                                                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white shrink-0">
                                                        <Clock className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-blue-900">Awaiting Client Payment</p>
                                                        <p className="text-[10px] text-blue-600 font-medium">Wait for the client to fund the escrow before starting work.</p>
                                                    </div>
                                                </div>
                                            ) : bid.job?.booking?.paymentStatus === "PAID_IN_ESCROW" ? (
                                                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shrink-0">
                                                        <Wallet className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-emerald-900">Payment Secured</p>
                                                        <p className="text-[10px] text-emerald-600 font-medium">Funds are held in escrow. You can start work on this project.</p>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[24px] border border-slate-50 border-dashed">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                    <Send className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-base font-semibold text-slate-900 mb-1">No bids yet</h3>
                                <p className="text-sm text-slate-400 font-medium">Browse jobs and submit your first proposal.</p>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Right Panel — Job Detail */}
            <div className="w-[450px] bg-white rounded-[32px] border border-slate-100 flex flex-col overflow-hidden">
                {selectedJob ? (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="p-8 pb-6 border-b border-slate-50 flex-shrink-0">
                            {/* Client */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                                    {selectedJob.client?.profilePicture ? (
                                        <NextImage src={selectedJob.client.profilePicture} alt="" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-sm font-bold text-slate-400">
                                            {selectedJob.client?.firstName?.[0] || "C"}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900">
                                        {selectedJob.client?.firstName} {selectedJob.client?.lastName}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 font-medium">{selectedJob.client?.city || "Remote"}</p>
                                </div>
                            </div>

                            <h2 className="text-lg font-semibold text-slate-900 tracking-tight mb-3">{selectedJob.title}</h2>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {selectedJob.budget && (
                                    <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-semibold border border-emerald-100">
                                        <DollarSign className="w-3.5 h-3.5" />
                                        RWF {parseFloat(selectedJob.budget).toLocaleString()}
                                    </span>
                                )}
                                {selectedJob.location && (
                                    <span className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold border border-blue-100">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {selectedJob.location}
                                    </span>
                                )}
                                {selectedJob.deadline && (
                                    <span className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-semibold border border-orange-100">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(selectedJob.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </span>
                                )}
                                <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold border border-slate-100">
                                    {selectedJob._count?.bids || 0} proposals
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex-1 overflow-y-auto p-8 pt-6">
                            <h3 className="text-[13px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Job Description</h3>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{selectedJob.description}</p>

                            {selectedJob.category && (
                                <div className="mt-6">
                                    <h3 className="text-[13px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Category</h3>
                                    <span className="px-3 py-1.5 bg-primary/5 text-primary rounded-lg text-xs font-semibold">
                                        {selectedJob.category.name}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Submit Bid Button */}
                        {selectedJob.status === "ACTIVE" && (
                            <div className="p-6 pt-4 border-t border-slate-50">
                                <button
                                    onClick={() => setShowBidModal(true)}
                                    className="w-full h-12 bg-primary text-white rounded-2xl font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Submit Proposal
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                            <Eye className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 mb-2">Job Details</h3>
                        <p className="text-sm font-medium text-slate-500 max-w-[200px]">
                            Select a job from the list to view full details and submit a proposal.
                        </p>
                    </div>
                )}
            </div>

            {/* Bid Submission Modal */}
            {showBidModal && selectedJob && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-slate-900">Submit Proposal</h2>
                            <button onClick={() => setShowBidModal(false)} className="p-2 rounded-xl hover:bg-slate-100 transition-all">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Job Summary */}
                        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                            <h4 className="text-sm font-semibold text-slate-900 mb-1">{selectedJob.title}</h4>
                            {selectedJob.budget && (
                                <p className="text-xs text-slate-500 font-medium">Client budget: RWF {parseFloat(selectedJob.budget).toLocaleString()}</p>
                            )}
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Your Proposed Price (RWF) *</label>
                                <input
                                    type="number"
                                    value={bidForm.amount}
                                    onChange={(e) => setBidForm({ ...bidForm, amount: e.target.value })}
                                    placeholder="Enter your price"
                                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Cover Letter / Message *</label>
                                <textarea
                                    value={bidForm.message}
                                    onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
                                    placeholder="Explain why you're the best fit for this job. Include your experience, approach, and timeline."
                                    rows={5}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowBidModal(false)}
                                className="flex-1 h-12 bg-slate-100 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitBid}
                                disabled={submitBid.isPending}
                                className="flex-1 h-12 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submitBid.isPending ? <Loading size="sm" /> : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Submit Proposal
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
