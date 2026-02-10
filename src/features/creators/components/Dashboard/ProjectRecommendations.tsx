"use client";

import React from "react";
import Image from "next/image";
import { Search } from "lucide-react";

const PROJECTS = [
    {
        id: "1",
        title: "Women conference 2026",
        description: "Videography for the 3rd women conference",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop"
    },
    {
        id: "2",
        title: "ULK Graduation",
        description: "final year graduation event",
        avatar: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=150&auto=format&fit=crop"
    },
];

export function ProjectRecommendations() {
    return (
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8 h-full">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Recommended Projects</h2>
            </div>

            <div className="space-y-6">
                {PROJECTS.map((project) => (
                    <div key={project.id} className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-2 rounded-2xl transition-all -m-2">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-100">
                            <Image
                                src={project.avatar}
                                alt={project.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-[15px] font-semibold text-slate-900 group-hover:text-primary transition-colors truncate">
                                {project.title}
                            </h4>
                            <p className="text-[13px] text-slate-400 font-medium line-clamp-1">
                                {project.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
