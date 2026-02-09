"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";

const CREATORS = [
    { id: 1, name: "Chris Musa", role: "Photographer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop" },
    { id: 2, name: "Emmanuel Mensah", role: "Photographer", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop" },
    { id: 3, name: "Michael NTWALI", role: "Photographer", avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=150&h=150&auto=format&fit=crop" },
    { id: 4, name: "Yvan SHEMA", role: "Videographer", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop" },
    { id: 5, name: "Tina TETA", role: "Videographer", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&h=150&auto=format&fit=crop" },
];

export function TrendingCreators() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-700 tracking-tight uppercase tracking-widest">Top Creators</h3>
                    <p className="text-[10px] text-slate-700 font-medium mt-1">Recommended for you</p>
                </div>
                <button className="text-[10px] font-semibold text-primary hover:underline transition-all">View All</button>
            </div>

            <div className="space-y-4">
                {CREATORS.slice(0, 4).map((creator) => (
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
                            <p className="text-[10px] font-medium text-primary uppercase tracking-tighter">{creator.role}</p>
                        </div>
                        <div className="w-8 h-8 flex items-center justify-center bg-white border border-slate-100 rounded-lg text-slate-700 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
