import { authStorage } from '@/lib/auth-storage';
import { useEffect, useCallback, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let globalSocket: Socket | null = null;
let socketRefCount = 0;

function getSocket(): Socket | null {
    const token = authStorage.getAccessToken();
    if (!token) return null;

    if (!globalSocket || globalSocket.disconnected) {
        globalSocket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 2000,
        });

        globalSocket.on('connect', () => {
            console.log('Socket connected');
        });

        globalSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
        });
    }

    return globalSocket;
}

export const useSocket = () => {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        socketRefCount++;

        const onConnect = () => setConnected(true);
        const onDisconnect = () => setConnected(false);

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        if (socket.connected) setConnected(true);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socketRefCount--;

            if (socketRefCount <= 0) {
                socket.disconnect();
                globalSocket = null;
                socketRefCount = 0;
            }
        };
    }, []);

    const emit = useCallback((event: string, data: any) => {
        const socket = getSocket();
        socket?.emit(event, data);
    }, []);

    const on = useCallback((event: string, callback: (...args: any[]) => void) => {
        const socket = getSocket();
        socket?.on(event, callback);
        return () => { socket?.off(event, callback); };
    }, []);

    return { socket: getSocket(), emit, on, connected };
};
