"use client";

import React, { useState } from "react";
import { Plus, LayoutGrid, FileText, Loader2, Sparkles } from "lucide-react";
import { useProfile } from "@/features/user/hooks/useProfile";
import { PortfolioGrid } from "./PortfolioGrid";
import { AddWorkModal } from "./AddWorkModal";
import { Button } from "@/components/ui/button";

export function PortfolioPage() {
    const { data: user, isLoading } = useProfile();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const portfolioItems = user?.creatorProfile?.portfolioMedia || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        My Portfolio
                        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                            {portfolioItems.length} items
                        </span>
                    </h1>
                    <p className="text-slate-500 mt-1">Manage and showcase your best work to clients.</p>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="rounded-xl h-11 px-6 bg-primary hover:bg-primary/90 text-white font-semibold transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Work
                </Button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-[32px] border border-slate-100 p-8 min-h-[400px] ">
                <PortfolioGrid items={portfolioItems} />
            </div>

            {/* Footer Tip */}
            {portfolioItems.length > 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-blue-900">Pro Tip</h4>
                        <p className="text-sm text-blue-700 mt-0.5 leading-relaxed">
                            Clients are 3x more likely to book creators with diverse portfolios.
                            Try adding a mix of photos, videos, and project links to showcase your versatility.
                        </p>
                    </div>
                </div>
            )}

            <AddWorkModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
}
