"use client";

import React from "react";
import Image from "next/image";
import { Search, Briefcase } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/features/jobs/services/job.service";
import { Loading } from "@/components/ui/loading";

export function ProjectRecommendations() {
    const { data: response, isLoading } = useQuery({
        queryKey: ["available-jobs"],
        queryFn: () => jobService.getJobs({ status: "ACTIVE" })
    });

    const jobs = response?.data?.data || response?.data || [];

    return (
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Available Jobs</h2>
                    <p className="text-[13px] text-slate-500 font-medium">New opportunities for you</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-3">
                        <Loading size="sm" />
                        <p className="text-[13px] text-slate-400 font-medium">Fetching jobs...</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                            <Briefcase className="w-8 h-8" />
                        </div>
                        <p className="text-[14px] font-semibold text-slate-600">No jobs available right now</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {jobs.map((job: any) => (
                            <div key={job.id} className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-3 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-100">
                                    {job.client?.profilePicture ? (
                                        <Image
                                            src={job.client.profilePicture}
                                            alt={job.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary text-lg font-bold">
                                            {job.title[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h4 className="text-[15px] font-bold text-slate-900 group-hover:text-primary transition-colors truncate">
                                            {job.title}
                                        </h4>
                                        <span className="text-[13px] font-bold text-slate-900 whitespace-nowrap">
                                            RWF {job.budget?.toLocaleString() || "N/A"}
                                        </span>
                                    </div>
                                    <p className="text-[13px] text-slate-500 font-medium line-clamp-1">
                                        {job.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
