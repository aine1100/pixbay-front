import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from './useSocket';
import { chatService, ChatMessage } from '../services/chat.service';
import { useUserStore } from '@/features/user/store/userStore';

export const useChat = (chatId: string | null) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const user = useUserStore(state => state.user);
    const { emit, on } = useSocket();
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const loadMessages = useCallback(async () => {
        if (!chatId) return;
        setIsLoading(true);
        try {
            const history = await chatService.getMessages(chatId);
            setMessages(history.reverse()); // Show oldest first for list
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setIsLoading(false);
        }
    }, [chatId]);

    useEffect(() => {
        if (chatId) {
            loadMessages();
            emit('join_chat', chatId);

            // Mark as read when opening a chat
            chatService.markAsRead(chatId).catch(() => {});
        }

        const offMsg = on('receive_message', (msg: ChatMessage) => {
            if (msg.chatId === chatId) {
                setMessages(prev => {
                    // Avoid duplicates
                    if (prev.some(m => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });

                // Mark as read since user has this chat open
                if (chatId) {
                    chatService.markAsRead(chatId).catch(() => {});
                }
            }
        });

        const offTyping = on('user_typing', (data: { userId: string, chatId: string }) => {
            if (data.chatId === chatId && data.userId !== user?.id) {
                setIsTyping(true);

                // Auto-reset after 5s if no stop event
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = setTimeout(() => {
                    setIsTyping(false);
                }, 5000);
            }
        });

        const offStopTyping = on('user_stop_typing', (data: { userId: string, chatId: string }) => {
            if (data.chatId === chatId && data.userId !== user?.id) {
                setIsTyping(false);
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            }
        });

        return () => {
            offMsg();
            offTyping();
            offStopTyping();
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, [chatId, loadMessages, emit, on, user?.id]);

    const sendMessage = useCallback((content: string) => {
        if (!chatId || !user) return;
        emit('send_message', {
            chatId,
            content,
            senderType: user.role
        });
    }, [chatId, user, emit]);

    const sendTyping = useCallback((isTyping: boolean) => {
        if (!chatId) return;
        emit(isTyping ? 'typing' : 'stop_typing', { chatId });
    }, [chatId, emit]);

    const uploadFile = useCallback(async (file: File) => {
        if (!chatId) return;
        setIsUploading(true);
        try {
            const message = await chatService.uploadDocument(chatId, file);
            // The socket emit from the backend will add the message in real-time.
            // But as a fallback, add it here too if not already present.
            setMessages(prev => {
                if (prev.some(m => m.id === message.id)) return prev;
                return [...prev, message];
            });
        } catch (error) {
            console.error('Failed to upload file:', error);
            throw error;
        } finally {
            setIsUploading(false);
        }
    }, [chatId]);

    return {
        messages,
        isLoading,
        isTyping,
        isUploading,
        sendMessage,
        sendTyping,
        uploadFile,
        refreshMessages: loadMessages
    };
};
