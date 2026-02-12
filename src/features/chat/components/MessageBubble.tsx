import React from 'react';
import { format } from 'date-fns';
import { FileIcon, Download } from 'lucide-react';
import { ChatMessage } from '../services/chat.service';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
    message: ChatMessage;
    isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
    const isDocument = message.messageType === 'DOCUMENT';
    const content = message.content;

    return (
        <div className={cn(
            "flex w-full mb-4",
            isOwn ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "max-w-[80%] md:max-w-[70%] rounded-[20px] px-4 py-3",
                isOwn ? "bg-slate-900 text-white rounded-tr-none" : "bg-slate-50 text-slate-900 rounded-tl-none border border-slate-100"
            )}>
                {isDocument ? (
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-2 rounded-xl",
                            isOwn ? "bg-slate-800" : "bg-white border border-slate-100"
                        )}>
                            <FileIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[14px] font-medium truncate">{content.fileName}</p>
                            <p className={cn(
                                "text-[11px]",
                                isOwn ? "text-slate-400" : "text-slate-500"
                            )}>
                                {(content.fileSize / 1024).toFixed(1)} KB
                            </p>
                        </div>
                        <a 
                            href={content.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={cn(
                                "p-2 rounded-full transition-colors",
                                isOwn ? "hover:bg-slate-800" : "hover:bg-white border border-transparent hover:border-slate-100"
                            )}
                        >
                            <Download className="w-4 h-4" />
                        </a>
                    </div>
                ) : (
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{content}</p>
                )}
                
                <div className={cn(
                    "mt-1 text-[10px] flex items-center gap-1",
                    isOwn ? "text-slate-400 justify-end" : "text-slate-500"
                )}>
                    {format(new Date(message.sentAt), 'HH:mm')}
                    {isOwn && message.status === 'READ' && (
                        <span className="text-blue-400 ml-1">• Read</span>
                    )}
                </div>
            </div>
        </div>
    );
};
