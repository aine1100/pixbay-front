import React, { useState } from "react";
import { Upload, X, Image as ImageIcon, Video, Link as LinkIcon, FileText, Globe, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { creatorService } from "../../services/creator.service";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface AddWorkModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type SampleType = "image" | "video" | "pdf" | "document" | "link";

interface PortfolioSample {
    id: string;
    type: SampleType;
    file?: File;
    preview?: string;
    url?: string;
}

export function AddWorkModal({ isOpen, onClose }: AddWorkModalProps) {
    const [samples, setSamples] = useState<PortfolioSample[]>([]);
    const [linkInput, setLinkInput] = useState("");
    const [title, setTitle] = useState("");
    const [explanation, setExplanation] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const queryClient = useQueryClient();

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const currentFilesCount = samples.filter(s => s.file).length;
            const newFilesCount = e.target.files.length;

            if (currentFilesCount + newFilesCount > 10) {
                toast.error("You can add a maximum of 10 files per project.");
                return;
            }

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
            toast.error("Please add at least one item.");
            return;
        }

        if (!title.trim()) {
            toast.error("Please provide a title for this project.");
            return;
        }

        setIsUploading(true);
        try {
            const links = samples.filter(s => s.type === "link" && s.url).map(s => s.url!);
            const files = samples.filter(s => s.file).map(s => s.file!);

            await creatorService.submitPortfolio({ 
                links, 
                files,
                title: title.trim(),
                explanation: explanation.trim()
            });

            // Invalidate query to refresh the list
            queryClient.invalidateQueries({ queryKey: ["user", "me"] });

            toast.success("Project added successfully!");
            setSamples([]);
            setTitle("");
            setExplanation("");
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to upload.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-[24px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Add New Project</h2>
                        <p className="text-sm text-slate-500">Group multiple images/videos into a single professional work</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Project Information */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Project Title</label>
                            <Input
                                placeholder="e.g. Wedding Shoot 2024, Product Campaign"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-11 bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white transition-all rounded-xl"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Explanation / Description</label>
                            <textarea
                                placeholder="Describe the project goals, your role, or any interesting details..."
                                value={explanation}
                                onChange={(e) => setExplanation(e.target.value)}
                                className="w-full min-h-[100px] p-4 bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white transition-all rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                    {/* Link Input Section */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Input
                                placeholder="Paste a URL (e.g. Behance, YouTube, Website)"
                                value={linkInput}
                                onChange={(e) => setLinkInput(e.target.value)}
                                className="h-11 bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white transition-all rounded-xl pl-10"
                            />
                            <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                        <Button
                            onClick={addLink}
                            disabled={!linkInput.trim()}
                            className="h-11 rounded-xl bg-slate-900 text-white px-6 font-semibold hover:bg-slate-800"
                        >
                            Add Link
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                        <div className="h-px bg-slate-100 flex-1" />
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">or upload files</span>
                        <div className="h-px bg-slate-100 flex-1" />
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
                        <div className="h-32 rounded-[20px] border-2 border-dashed border-slate-200 bg-slate-50/50 group-hover:bg-slate-50 group-hover:border-primary/30 transition-all flex flex-col items-center justify-center p-4 text-center">
                            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors flex items-center justify-center mb-3">
                                <Upload className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-semibold text-slate-700">Click to upload or drag and drop</p>
                            <p className="text-xs text-slate-400 mt-1">Images, Videos, or Documents (Max 10MB)</p>
                        </div>
                    </div>

                    {/* Pending Items Grid */}
                    {samples.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-900">Items to Add ({samples.length})</h3>
                                <button
                                    onClick={() => setSamples([])}
                                    className="text-xs font-medium text-red-500 hover:text-red-600"
                                >
                                    Clear all
                                </button>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {samples.map((sample) => (
                                    <div key={sample.id} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group bg-slate-50 flex flex-col items-center justify-center p-2 text-center">
                                        {sample.type === "image" && sample.preview ? (
                                            <img src={sample.preview} alt="Sample" className="absolute inset-0 w-full h-full object-cover" />
                                        ) : sample.type === "video" ? (
                                            <Video className="w-8 h-8 text-slate-400 mb-1" />
                                        ) : sample.type === "pdf" ? (
                                            <FileText className="w-8 h-8 text-red-400 mb-1" />
                                        ) : sample.type === "link" ? (
                                            <Globe className="w-8 h-8 text-blue-400 mb-1" />
                                        ) : (
                                            <FileText className="w-8 h-8 text-slate-400 mb-1" />
                                        )}

                                        <div className="z-10 bg-white/90 backdrop-blur-sm rounded-md px-1.5 py-0.5 flex items-center justify-center shadow-sm absolute bottom-2 inset-x-2">
                                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tighter truncate w-full block">
                                                {sample.type === "link" ? "Link" : sample.type}
                                            </span>
                                        </div>

                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                                            <button
                                                onClick={() => removeSample(sample.id)}
                                                className="p-1.5 bg-white rounded-lg text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div className="aspect-square rounded-xl border-2 border-dashed border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*,video/*,.pdf,.doc,.docx"
                                    />
                                    <Plus className="w-6 h-6 text-slate-300" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="rounded-xl font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={samples.length === 0 || isUploading}
                        className={cn(
                            "rounded-xl font-semibold px-8 min-w-[120px] transition-all",
                            isUploading ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90"
                        )}
                    >
                        {isUploading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Saving...</span>
                            </div>
                        ) : (
                            "Save to Portfolio"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
