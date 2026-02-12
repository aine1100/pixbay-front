import React, { useState, useRef, useCallback } from 'react';
import { Send, Paperclip, X, FileIcon, Loader2 } from 'lucide-react';

interface ChatInputProps {
    onSendMessage: (content: string) => void;
    onUploadFile: (file: File) => Promise<void>;
    onTyping: (isTyping: boolean) => void;
    isUploading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
    onSendMessage, 
    onUploadFile, 
    onTyping,
    isUploading = false
}) => {
    const [text, setText] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleTyping = useCallback((value: string) => {
        if (value.length > 0) {
            onTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => onTyping(false), 2000);
        } else {
            onTyping(false);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        }
    }, [onTyping]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onSendMessage(text.trim());
            setText("");
            onTyping(false);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendFile = async () => {
        if (!selectedFile || isUploading) return;
        try {
            await onUploadFile(selectedFile);
            setSelectedFile(null);
        } catch (error) {
            // Keep the file selected so user can retry
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="border-t border-slate-100 bg-white">
            {/* File preview bar */}
            {selectedFile && (
                <div className="px-5 pt-3 pb-1">
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
                        <div className="p-1.5 bg-white rounded-lg border border-slate-100">
                            <FileIcon className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-slate-700 truncate">{selectedFile.name}</p>
                            <p className="text-[11px] text-slate-400">{formatFileSize(selectedFile.size)}</p>
                        </div>
                        {isUploading ? (
                            <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                        ) : (
                            <button onClick={removeFile} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                                <X className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            <form onSubmit={selectedFile ? (e) => { e.preventDefault(); handleSendFile(); } : handleSubmit} className="flex items-center gap-3 px-5 py-4">
                <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                />
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"
                    disabled={isUploading}
                >
                    <Paperclip className="w-5 h-5" />
                </button>
                <input 
                    type="text"
                    value={text}
                    onChange={(e) => { setText(e.target.value); handleTyping(e.target.value); }}
                    placeholder={selectedFile ? "Press send to upload file..." : "Type a message..."}
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-slate-200 transition-all"
                    disabled={isUploading}
                />
                <button 
                    type="submit" 
                    disabled={(!text.trim() && !selectedFile) || isUploading}
                    className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {isUploading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </button>
            </form>
        </div>
    );
};
