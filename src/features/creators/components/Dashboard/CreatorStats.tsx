"use client";

import React from "react";
import { Folder, DollarSign, Star, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STATS = [
    { label: "Total Projects", value: "0", trend: "+$0 from last week", icon: Folder },
    { label: "Income", value: "$0", trend: "+$0 from last week", icon: DollarSign },
    { label: "Ratings", value: "0.0", trend: "+0 from last week", icon: Star },
    { label: "Completed Orders", value: "0", trend: "+2 from last week", icon: CheckCircle2 },
];

export function CreatorStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {STATS.map((stat, index) => (
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
                                Last week
                            </span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-500 mb-1">{stat.label}</h3>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-semibold text-slate-900 leading-none">
                                {stat.value}
                            </span>
                            <span className="text-[12px] font-semibold text-slate-400 mb-1">
                                {stat.trend}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
