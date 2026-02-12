"use client";

import React, { useState } from "react";
import { X, Upload, Plus, Link as LinkIcon, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { bookingService } from "../services/booking.service";
import { toast } from "react-hot-toast";

interface AddProjectMediaModalProps {
    bookingId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddProjectMediaModal({ bookingId, isOpen, onClose, onSuccess }: AddProjectMediaModalProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [links, setLinks] = useState<string[]>([""]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetState = () => {
        setFiles([]);
        setLinks([""]);
        setIsSubmitting(false);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleLinkChange = (index: number, value: string) => {
        const newLinks = [...links];
        newLinks[index] = value;
        setLinks(newLinks);
    };

    const addLinkField = () => {
        setLinks(prev => [...prev, ""]);
    };

    const removeLinkField = (index: number) => {
        setLinks(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0 && links.every(l => !l.trim())) {
            toast.error("Please add at least one file or link");
            return;
        }

        setIsSubmitting(true);
        try {
            const validLinks = links.filter(l => l.trim() !== "");
            await bookingService.uploadProjectMedia(bookingId, {
                files,
                links: validLinks
            });
            toast.success("Project media uploaded successfully");
            onSuccess();
            handleClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to upload project media");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Add Project Images</h3>
                        <p className="text-sm text-slate-500 mt-1">Deliver images and links for this project</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* File Upload Area */}
                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-slate-700">Upload Files</label>
                        <div className="relative group">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 group-hover:bg-slate-100 transition-colors">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
                                    <Upload className="w-6 h-6 text-primary" />
                                </div>
                                <p className="text-sm font-semibold text-slate-700">Click or drag files to upload</p>
                                <p className="text-xs text-slate-400 mt-1 font-medium">Support: JPG, PNG, MP4, PDF (max 10 items)</p>
                            </div>
                        </div>

                        {files.length > 0 && (
                            <div className="grid grid-cols-2 gap-3">
                                {files.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                                {file.type.startsWith("image/") ? <ImageIcon className="w-4 h-4 text-blue-500" /> : <FileText className="w-4 h-4 text-orange-500" />}
                                            </div>
                                            <span className="text-xs font-medium text-slate-700 truncate">{file.name}</span>
                                        </div>
                                        <button type="button" onClick={() => removeFile(i)} className="p-1 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-all">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Links Input Area */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-slate-700">External Links</label>
                            <button type="button" onClick={addLinkField} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                                <Plus className="w-3 h-3" /> Add Link
                            </button>
                        </div>
                        <div className="space-y-3">
                            {links.map((link, i) => (
                                <div key={i} className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                            <LinkIcon className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <input
                                            type="url"
                                            value={link}
                                            onChange={(e) => handleLinkChange(i, e.target.value)}
                                            placeholder="https://..."
                                            className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-primary/30 transition-all"
                                        />
                                    </div>
                                    {links.length > 1 && (
                                        <button type="button" onClick={() => removeLinkField(i)} className="p-3 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all">
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 h-12 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-white transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-[2] h-12 bg-primary text-white rounded-2xl text-sm font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            "Finish Delivery"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
