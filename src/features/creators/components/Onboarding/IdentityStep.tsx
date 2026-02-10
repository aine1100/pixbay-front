"use client";

import React, { useState } from "react";
import { Upload, X, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IdentityStepProps {
    onNext: (data: any) => void;
    onBack: () => void;
}

export function IdentityStep({ onNext, onBack }: IdentityStepProps) {
    const [files, setFiles] = useState<{ front: File | null; back: File | null }>({
        front: null,
        back: null,
    });
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (side: "front" | "back") => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFiles((prev) => ({ ...prev, [side]: e.target.files![0] }));
        }
    };

    const removeFile = (side: "front" | "back") => {
        setFiles((prev) => ({ ...prev, [side]: null }));
    };

    const handleSubmit = async () => {
        if (!files.front || !files.back) return;
        setIsUploading(true);
        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsUploading(false);
        onNext({ identityDocuments: files });
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-1">Verify your Identity</h2>
                <p className="text-slate-500 text-xs leading-relaxed">
                    Please upload your identity card from an authorized ID issuer body from your country.
                    <span className="block mt-0.5 font-medium text-slate-400">
                        (You are required to upload the front and back of the card)
                    </span>
                </p>
            </div>

            <div className="space-y-4">
                {/* Upload Box Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(["front", "back"] as const).map((side) => (
                        <div key={side} className="space-y-2">
                            <label className="text-[12px] font-semibold text-slate-700 capitalize">
                                {side} of the Card
                            </label>

                            <div
                                className={cn(
                                    "relative h-56 rounded-[24px] border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center",
                                    files[side]
                                        ? "border-primary/20 bg-primary/[0.02]"
                                        : "border-slate-100 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-200"
                                )}
                            >
                                {files[side] ? (
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <p className="text-sm font-semibold text-slate-900 truncate max-w-[130px]">
                                            {files[side]?.name}
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                            {(files[side]!.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                        <button
                                            onClick={() => removeFile(side)}
                                            className="absolute top-2 right-2 p-1 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                        <div className="mt-2 flex items-center gap-1.5 text-primary">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span className="text-[11px] font-bold uppercase tracking-wider">File Selected</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <input
                                            type="file"
                                            onChange={handleFileChange(side)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*,.pdf"
                                        />
                                        <div className="w-10 h-10 rounded-full bg-white border border-slate-100 p-2 text-primary flex items-center justify-center mb-3">
                                            <Upload className="w-5 h-5" />
                                        </div>
                                        <p className="text-[13px] font-semibold text-slate-900 mb-0.5">
                                            Drag and drop Files
                                        </p>
                                        <p className="text-[11px] text-slate-400">JPEG, PNG, PDF, up to 10MB</p>
                                        <div className="mt-4 flex items-center gap-3 w-full px-4">
                                            <div className="h-[1px] flex-1 bg-slate-100"></div>
                                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">OR</span>
                                            <div className="h-[1px] flex-1 bg-slate-100"></div>
                                        </div>

                                        <Button
                                            variant="outline"
                                            className="mt-4 w-[220px] h-10 rounded-full border-slate-100 text-[#1E293B] font-semibold hover:bg-slate-50 hover:border-slate-200 transition-all text-[13px]"
                                        >
                                            Select File
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

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
                            disabled={!files.front || !files.back || isUploading}
                            className="rounded-[20px] bg-[#FF9B9B] hover:bg-[#FF8A8A] text-white font-semibold h-12 px-12 text-[15px] transition-all border-none"
                        >
                            {isUploading ? "Uploading..." : "Next Step"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
