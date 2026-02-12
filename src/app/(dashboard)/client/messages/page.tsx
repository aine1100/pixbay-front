"use client";

import { MessagesView } from "@/features/chat/components/MessagesView";

export default function ClientMessagesPage() {
    return (
        <div className="p-6 h-[calc(100vh-80px)]">
            <MessagesView />
        </div>
    );
}
