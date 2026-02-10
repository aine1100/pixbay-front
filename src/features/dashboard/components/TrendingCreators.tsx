"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useCreators } from "@/features/creators/hooks/useCreators";
import { Loading } from "@/components/ui/loading";

export function TrendingCreators() {
    const { data: creators, isLoading } = useCreators();

    const displayCreators = (creators || []).map((c: any) => ({
        id: c.id,
        name: `${c.user.firstName} ${c.user.lastName}`,
        role: c.creatorType.charAt(0) + c.creatorType.slice(1).toLowerCase().replace('_', ' '),
        avatar: c.user.profilePicture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop"
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-700 tracking-tight  tracking-widest">Top Creators</h3>
                    <p className="text-[10px] text-slate-700 font-medium mt-1">Recommended for you</p>
                </div>
                <button className="text-[10px] font-semibold text-primary hover:underline transition-all">View All</button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <Loading size="sm" />
                    <p className="text-[10px] font-medium text-slate-500 mt-2">Finding top creators...</p>
                </div>
            ) : displayCreators.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 rounded-2xl ">
                    <p className="text-[10px] font-bold text-slate-400  tracking-widest">No creators found</p>
                    <p className="text-[10px] text-slate-400 mt-1 italic">Check back later for new talent</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {displayCreators.slice(0, 4).map((creator: any) => (
                        <div key={creator.id} className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-2xl transition-all">
                            <div className="w-12 h-12 rounded-xl border border-slate-100 bg-slate-100 relative overflow-hidden flex-shrink-0">
                                <Image
                                    src={creator.avatar}
                                    alt={creator.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-semibold text-slate-700 truncate">{creator.name}</h4>
                                <p className="text-[10px] font-medium text-slate-500  tracking-tighter">{creator.role}</p>
                            </div>
                            <div className="w-8 h-8 flex items-center justify-center bg-white border border-slate-100 rounded-lg text-slate-700 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
