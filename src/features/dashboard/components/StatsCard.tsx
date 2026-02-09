"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string;
    trend: string;
    trendType: "up" | "down";
    description: string;
    icon: React.ElementType;
}

export function StatsCard({ title, value, trend, trendType, description, icon: Icon }: StatsCardProps) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 transition-all hover:border-slate-200">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-red-50 rounded-2xl text-primary">
                    <Icon className="w-5 h-5" />
                </div>
                <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold",
                    trendType === "up" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                )}>
                    {trendType === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {trend}
                </div>
            </div>

            <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
                <p className="text-2xl font-bold text-slate-700 tracking-tight">{value}</p>
                <p className="text-[11px] text-slate-700 font-medium">
                    <span className="text-primary font-semibold">{description}</span> from last week
                </p>
            </div>
        </div>
    );
}
