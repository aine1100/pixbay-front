"use client";

import React from "react";
import { ExternalLink, ImageIcon, FileText, Link as LinkIcon, Download } from "lucide-react";

interface MediaItem {
    type: "IMAGE" | "VIDEO" | "DOCUMENT" | "LINK";
    url: string;
    uploadedAt: string;
    metadata?: {
        originalName?: string;
        title?: string;
        description?: string;
    };
}

interface ProjectMediaGalleryProps {
    delivery?: {
        items?: MediaItem[];
    };
}

export function ProjectMediaGallery({ delivery }: ProjectMediaGalleryProps) {
    const items = delivery?.items || [];
    const images = items.filter(i => i.type === "IMAGE");
    const others = items.filter(i => i.type !== "IMAGE");

    if (items.length === 0) return null;

    return (
        <div className="space-y-8 mt-12 pt-12 border-t border-slate-100 animate-in fade-in duration-700">
            <div>
                <h3 className="text-xl font-semibold text-slate-900">Project Deliverables</h3>
                <p className="text-sm text-slate-500 mt-1">Final media and resources delivered for this project</p>
            </div>

            {/* Images Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((img, i) => (
                        <div key={i} className="group relative aspect-square bg-slate-50 rounded-[32px] overflow-hidden border border-slate-100">
                            <img
                                src={img.url}
                                alt={img.metadata?.title || "Project Image"}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                <a
                                    href={img.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:scale-110 transition-transform"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                                <a
                                    href={img.url}
                                    download
                                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:scale-110 transition-transform"
                                >
                                    <Download className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Other Files & Links */}
            {others.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {others.map((item, i) => (
                        <a
                            key={i}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-3xl hover:border-primary/20 hover:bg-slate-50 transition-all group"
                        >
                            <div className="w-12 h-12 bg-slate-50 group-hover:bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                {item.type === "LINK" ? <LinkIcon className="w-5 h-5" /> :
                                    item.type === "VIDEO" ? <ImageIcon className="w-5 h-5" /> :
                                        <FileText className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-700 truncate">
                                    {item.metadata?.originalName || item.metadata?.title || "External Resource"}
                                </p>
                                <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                                    {item.type} • Click to view
                                </p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
