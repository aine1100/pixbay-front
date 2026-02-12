import { useEffect, useState, useCallback } from 'react';
import { chatService } from '../services/chat.service';
import { useSocket } from './useSocket';

export const useUnreadCount = () => {
    const [count, setCount] = useState(0);
    const { on } = useSocket();

    const fetchCount = useCallback(async () => {
        try {
            const total = await chatService.getUnreadCount();
            setCount(total);
        } catch (error) {
            // silently fail
        }
    }, []);

    useEffect(() => {
        fetchCount();

        // Poll every 30s as a fallback
        const interval = setInterval(fetchCount, 30000);

        // Increment on new message
        const offMsg = on('receive_message', () => {
            setCount(prev => prev + 1);
        });

        // Decrement when we read messages
        const offRead = on('messages_marked_read', () => {
            fetchCount(); // refetch to get accurate count
        });

        return () => {
            clearInterval(interval);
            offMsg();
            offRead();
        };
    }, [fetchCount, on]);

    return count;
};
