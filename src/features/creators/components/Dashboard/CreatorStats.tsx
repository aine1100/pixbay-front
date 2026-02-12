"use client";

import React from "react";
import { Folder, DollarSign, Star, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreatorStatsProps {
    stats?: {
        totalProjects?: number;
        income?: number;
        averageRating?: number;
        completedOrders?: number;
    };
    isLoading?: boolean;
}

export function CreatorStats({ stats = {}, isLoading = false }: CreatorStatsProps) {
    const items = [
        { label: "Total Projects", value: isLoading ? "..." : stats.totalProjects?.toString() || "0", trend: "Total", icon: Folder },
        { label: "Income", value: isLoading ? "..." : `RWF ${stats.income?.toLocaleString() || "0"}`, trend: "Lifetime", icon: DollarSign },
        { label: "Ratings", value: isLoading ? "..." : stats.averageRating?.toFixed(1) || "0.0", trend: "Average", icon: Star },
        { label: "Completed Orders", value: isLoading ? "..." : stats.completedOrders?.toString() || "0", trend: "Total", icon: CheckCircle2 },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {items.map((stat, index) => (
                <div
                    key={stat.label}
                    className="bg-white rounded-[24px] border border-slate-100 p-6 space-y-4 hover:border-primary/20 transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div className="bg-slate-50 group-hover:bg-primary/5 px-3 py-1 rounded-full">
                            <span className="text-[11px] font-semibold text-slate-400 group-hover:text-primary transition-colors tracking-wider">
                                {stat.trend}
                            </span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-500 mb-1">{stat.label}</h3>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-semibold text-slate-900 leading-none">
                                {stat.value}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
