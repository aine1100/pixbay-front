import { api } from "@/services/api";

export interface ChatMessage {
    id: string;
    chatId: string;
    senderId: string;
    senderType: string;
    messageType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'SYSTEM';
    content: any;
    status: 'SENT' | 'DELIVERED' | 'READ';
    sentAt: string;
    sender: {
        firstName: string;
        lastName: string;
        profilePicture: string | null;
        role: string;
    };
}

export interface Chat {
    id: string;
    bookingId: string | null;
    booking?: {
        id: string;
        bookingNumber: string;
        status: string;
    };
    otherUser: {
        id: string;
        firstName: string;
        lastName: string;
        profilePicture: string | null;
        role: string;
    };
    lastMessage: {
        content: any;
        senderId: string;
        sentAt: string;
        messageType: string;
    } | null;
    unreadCount: number;
    updatedAt: string;
}

export const chatService = {
    async listChats(): Promise<Chat[]> {
        const response = await api.get("/chats");
        return response.data;
    },

    async getMessages(chatId: string, limit = 50, offset = 0): Promise<ChatMessage[]> {
        const response = await api.get(`/chats/${chatId}/messages`, {
            params: { limit, offset }
        });
        return response.data;
    },

    async initiateChat(recipientId?: string, bookingId?: string): Promise<Chat> {
        const response = await api.post("/chats/initiate", { recipientId, bookingId });
        return response.data;
    },

    async markAsRead(chatId: string): Promise<{ success: boolean }> {
        const response = await api.patch(`/chats/${chatId}/read`, {});
        return response.data;
    },

    async getUnreadCount(): Promise<number> {
        const response = await api.get("/chats/unread-count");
        return response.count ?? 0;
    },

    async uploadDocument(chatId: string, file: File): Promise<ChatMessage> {
        const formData = new FormData();
        formData.append("attachment", file);

        const response = await api.post(`/chats/${chatId}/upload`, formData);
        return response.data;
    },
};

