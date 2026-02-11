"use client";

import React, { useState } from "react";
import { Upload, X, Image as ImageIcon, Video, CheckCircle2, Plus, Link as LinkIcon, FileText, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { creatorService } from "../../services/creator.service";
import { toast } from "react-hot-toast";

interface PortfolioStepProps {
    onNext: (data: any) => void;
    onBack: () => void;
}

type SampleType = "image" | "video" | "pdf" | "document" | "link";

interface PortfolioSample {
    id: string;
    type: SampleType;
    file?: File;
    preview?: string;
    url?: string;
}

export function PortfolioStep({ onNext, onBack }: PortfolioStepProps) {
    const [samples, setSamples] = useState<PortfolioSample[]>([]);
    const [linkInput, setLinkInput] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const newSamples = newFiles.map((file): PortfolioSample => {
                let type: SampleType = "document";
                if (file.type.startsWith("image/")) type = "image";
                else if (file.type.startsWith("video/")) type = "video";
                else if (file.type === "application/pdf") type = "pdf";

                return {
                    id: Math.random().toString(36).substr(2, 9),
                    file,
                    type,
                    preview: type === "image" ? URL.createObjectURL(file) : undefined,
                };
            });
            setSamples((prev) => [...prev, ...newSamples]);
        }
    };

    const addLink = () => {
        if (!linkInput.trim()) return;
        const newSample: PortfolioSample = {
            id: Math.random().toString(36).substr(2, 9),
            type: "link",
            url: linkInput.trim(),
        };
        setSamples((prev) => [...prev, newSample]);
        setLinkInput("");
    };

    const removeSample = (id: string) => {
        setSamples((prev) => {
            const filtered = prev.filter((s) => s.id !== id);
            const removed = prev.find((s) => s.id === id);
            if (removed?.preview) URL.revokeObjectURL(removed.preview);
            return filtered;
        });
    };

    const handleSubmit = async () => {
        if (samples.length === 0) {
            toast.error("Please add at least one portfolio item.");
            return;
        }
        setIsUploading(true);
        try {
            const links = samples.filter(s => s.type === "link" && s.url).map(s => s.url!);
            const files = samples.filter(s => s.file).map(s => s.file!);
            
            await creatorService.submitPortfolio({ links, files });
            toast.success("Portfolio updated successfully!");
            onNext({ portfolio: samples });
        } catch (error: any) {
            toast.error(error.message || "Failed to update portfolio.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-1">Showcase your Portfolio</h2>
                <p className="text-slate-500 text-xs leading-relaxed">
                    Upload samples (Images, Videos, PDFs) or add links to your work.
                    <span className="block mt-0.5 font-medium text-slate-400">
                        (Minimum 3 samples recommended)
                    </span>
                </p>
            </div>

            <div className="space-y-4">
                {/* Link Input Section */}
                <div className="flex items-center gap-3">
                    <label className="text-[11px] font-semibold text-slate-700 whitespace-nowrap">Link</label>
                    <div className="relative flex-1">
                        <Input
                            placeholder="e.g. Behance URL"
                            value={linkInput}
                            onChange={(e) => setLinkInput(e.target.value)}
                            className="h-9 bg-slate-50 border-none rounded-lg text-[13px] pl-9 focus:ring-2 focus:ring-primary/20"
                        />
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <Button 
                        onClick={addLink}
                        disabled={!linkInput.trim()}
                        className="h-9 rounded-lg bg-primary text-white px-5 text-sm font-semibold transition-all"
                    >
                        Add
                    </Button>
                </div>

                {/* Upload Area */}
                <div className="relative group">
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        accept="image/*,video/*,.pdf,.doc,.docx"
                    />
                    <div className="h-24 rounded-[20px] border-2 border-dashed border-slate-100 bg-slate-50/30 group-hover:bg-slate-50 group-hover:border-slate-200 transition-all flex flex-col items-center justify-center p-3 text-center">
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-100 text-primary flex items-center justify-center mb-1.5">
                            <Plus className="w-4 h-4" />
                        </div>
                        <p className="text-[12px] font-semibold text-slate-900 mb-0.5">Add Media Files</p>
                        <p className="text-[10px] text-slate-400 font-medium">Video, PDF, or Documents</p>
                    </div>
                </div>

                {/* Samples Grid */}
                {samples.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                        {samples.map((sample) => (
                            <div key={sample.id} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group bg-slate-50 flex flex-col items-center justify-center p-2 text-center">
                                {sample.type === "image" && sample.preview ? (
                                    <img src={sample.preview} alt="Sample" className="absolute inset-0 w-full h-full object-cover" />
                                ) : sample.type === "video" ? (
                                    <Video className="w-6 h-6 text-slate-400 mb-0.5" />
                                ) : sample.type === "pdf" ? (
                                    <FileText className="w-6 h-6 text-red-400 mb-0.5" />
                                ) : sample.type === "link" ? (
                                    <Globe className="w-6 h-6 text-blue-400 mb-0.5" />
                                ) : (
                                    <FileText className="w-6 h-6 text-slate-400 mb-0.5" />
                                )}

                                <div className="z-10 bg-white/90 backdrop-blur-sm rounded-md px-1.5 py-0.5 flex items-center gap-0.5 shadow-sm mt-auto max-w-full">
                                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter truncate">
                                        {sample.type === "link" ? sample.url?.replace(/^https?:\/\//, "") : (sample.file?.name || sample.type)}
                                    </span>
                                </div>
                                
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                                    <button
                                        onClick={() => removeSample(sample.id)}
                                        className="p-1 bg-white rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer Actions */}
                <div className="pt-8 flex items-center justify-between border-t border-slate-50 mt-10">
                    <button
                        onClick={onBack}
                        className="text-slate-500 font-semibold px-4 hover:text-slate-700 transition-colors text-[15px]"
                    >
                        Previous
                    </button>
                    <div className="flex gap-4 items-center">
                        <Button
                            variant="outline"
                            onClick={onBack}
                            className="rounded-full border-slate-100 text-slate-700 font-semibold h-12 px-8 text-[15px] hover:bg-slate-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={samples.length === 0 || isUploading}
                            className={cn(
                                "rounded-[20px] font-semibold h-12 px-12 text-[15px] transition-all border-none",
                                samples.length >= 3 
                                    ? "bg-primary text-white" 
                                    : "bg-primary/50 text-white"
                            )}
                        >
                            {isUploading ? "Saving..." : "Next Step"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
