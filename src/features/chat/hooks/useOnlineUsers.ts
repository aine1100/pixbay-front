import { useEffect, useState, useCallback } from 'react';
import { useSocket } from './useSocket';

export const useOnlineUsers = () => {
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const { on, emit } = useSocket();

    useEffect(() => {
        // Request online users list on mount
        emit('get_online_users', {});

        const offList = on('online_users', (userIds: string[]) => {
            setOnlineUsers(new Set(userIds));
        });

        const offOnline = on('user_online', (data: { userId: string }) => {
            setOnlineUsers(prev => new Set([...prev, data.userId]));
        });

        const offOffline = on('user_offline', (data: { userId: string }) => {
            setOnlineUsers(prev => {
                const next = new Set(prev);
                next.delete(data.userId);
                return next;
            });
        });

        return () => {
            offList();
            offOnline();
            offOffline();
        };
    }, [on, emit]);

    const isOnline = useCallback((userId: string) => onlineUsers.has(userId), [onlineUsers]);

    return { onlineUsers, isOnline };
};
