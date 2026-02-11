import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Play, FileText, Link as LinkIcon } from "lucide-react";

interface PortfolioMedia {
    id: string;
    type: string; // "IMAGE", "VIDEO", "DOCUMENT", "LINK"
    url: string;
    metadata?: any;
}

interface PortfolioGridProps {
    items: PortfolioMedia[];
}

export function PortfolioGrid({ items }: PortfolioGridProps) {
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

    const nextItem = useCallback(() => {
        if (selectedItemIndex !== null) {
            setSelectedItemIndex((selectedItemIndex + 1) % items.length);
        }
    }, [selectedItemIndex, items.length]);

    const prevItem = useCallback(() => {
        if (selectedItemIndex !== null) {
            setSelectedItemIndex((selectedItemIndex - 1 + items.length) % items.length);
        }
    }, [selectedItemIndex, items.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedItemIndex === null) return;
            if (e.key === "Escape") setSelectedItemIndex(null);
            if (e.key === "ArrowRight") nextItem();
            if (e.key === "ArrowLeft") prevItem();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedItemIndex, nextItem, prevItem]);

    if (!items || items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-[32px] bg-white">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No work added yet</h3>
                <p className="text-slate-500 text-sm mt-1">Start by adding your first project or link.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        onClick={() => setSelectedItemIndex(index)}
                        className="group relative rounded-[24px] overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-100 transition-all hover:border-primary/20 cursor-pointer"
                    >
                        {item.type === "IMAGE" && (
                            <Image
                                src={item.url}
                                alt="Portfolio item"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        )}
                        {item.type === "VIDEO" && (
                            <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                <Play className="w-12 h-12 text-white/50" />
                            </div>
                        )}
                        {item.type === "LINK" && (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-white p-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mb-3">
                                    <LinkIcon className="w-6 h-6 text-primary" />
                                </div>
                                <span className="text-sm font-semibold text-slate-900 line-clamp-2">{item.url}</span>
                            </div>
                        )}
                        {item.type === "DOCUMENT" && (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-white p-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                                    <FileText className="w-6 h-6 text-slate-400" />
                                </div>
                                <span className="text-sm font-semibold text-slate-900 line-clamp-2">{item.metadata?.originalName || "Document"}</span>
                            </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="text-white text-xs font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                                {item.type}
                             </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {selectedItemIndex !== null && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-300"
                    onClick={() => setSelectedItemIndex(null)}
                >
                    <div className="absolute top-0 inset-x-0 p-8 flex items-center justify-between z-50">
                        <div className="flex flex-col">
                            <h3 className="text-white text-xl font-semibold capitalize">{items[selectedItemIndex].type.toLowerCase()}</h3>
                            <p className="text-white/50 text-sm font-medium">
                                Item {selectedItemIndex + 1} of {items.length}
                            </p>
                        </div>
                        <button 
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-95"
                            onClick={(e) => { e.stopPropagation(); setSelectedItemIndex(null); }}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="relative w-full h-[70vh] flex items-center justify-center gap-8 px-4" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="absolute left-10 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-50 border border-white/10 active:scale-90"
                            onClick={prevItem}
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>

                        <button 
                            className="absolute right-10 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-50 border border-white/10 active:scale-90"
                            onClick={nextItem}
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>

                        <div className="relative w-full max-w-5xl h-full rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
                            {items[selectedItemIndex].type === "IMAGE" && (
                                <Image
                                    src={items[selectedItemIndex].url}
                                    alt="Portfolio item"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            )}
                            {items[selectedItemIndex].type === "LINK" && (
                                <div className="w-full h-full bg-white flex flex-col items-center justify-center p-20 text-center">
                                    <LinkIcon className="w-20 h-20 text-primary/20 mb-8" />
                                    <h2 className="text-2xl font-bold text-slate-900 mb-4">External Link</h2>
                                    <p className="text-slate-500 max-w-lg mb-8">{items[selectedItemIndex].url}</p>
                                    <a 
                                        href={items[selectedItemIndex].url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="h-14 px-12 bg-primary text-white rounded-2xl font-semibold flex items-center justify-center hover:bg-primary/90 transition-all"
                                    >
                                        Visit Website
                                    </a>
                                </div>
                            )}
                            {items[selectedItemIndex].type === "VIDEO" && (
                                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                    <video 
                                        src={items[selectedItemIndex].url} 
                                        controls 
                                        className="max-w-full max-h-full"
                                        autoPlay
                                    />
                                </div>
                            )}
                            {items[selectedItemIndex].type === "DOCUMENT" && (
                                <div className="w-full h-full bg-white flex flex-col items-center justify-center p-20 text-center">
                                    <FileText className="w-20 h-20 text-slate-200 mb-8" />
                                    <h2 className="text-2xl font-bold text-slate-900 mb-4">{items[selectedItemIndex].metadata?.originalName || "Document"}</h2>
                                    <a 
                                        href={items[selectedItemIndex].url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="h-14 px-12 bg-slate-900 text-white rounded-2xl font-semibold flex items-center justify-center hover:bg-slate-800 transition-all"
                                    >
                                        Download Document
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
