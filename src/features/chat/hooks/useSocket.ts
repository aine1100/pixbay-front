import { authStorage } from '@/lib/auth-storage';
import { useEffect, useCallback, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let globalSocket: Socket | null = null;
let socketRefCount = 0;
let lastToken: string | null = null;

function getSocket(): Socket | null {
    const token = authStorage.getAccessToken();
    if (!token) {
        if (globalSocket) {
            console.log('No token found, disconnecting socket');
            globalSocket.disconnect();
            globalSocket = null;
            lastToken = null;
        }
        return null;
    }

    // If token changed, disconnect old socket
    if (globalSocket && lastToken !== token) {
        console.log('Token changed, recreating socket');
        globalSocket.disconnect();
        globalSocket = null;
    }

    if (!globalSocket || globalSocket.disconnected) {
        // Remove existing listeners if recreating
        if (globalSocket) {
            globalSocket.removeAllListeners();
        }

        lastToken = token;
        globalSocket = io(SOCKET_URL, {
            auth: { token },
            reconnection: true,
            reconnectionAttempts: 20,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            // Explicitly allow polling and websocket
            transports: ['polling', 'websocket'],
        });

        globalSocket.on('connect', () => {
            console.log(`Socket connected successfully using ${globalSocket?.io.engine.transport.name} transport`);
        });

        globalSocket.on('connect_error', (error) => {
            console.error('Socket connection error (attempting reconnection):', error.message);
        });

        globalSocket.on('reconnect_attempt', (attempt) => {
            console.log(`Socket reconnection attempt: ${attempt}`);
        });

        // Log when transport upgrades
        globalSocket.io.engine.on('upgrade', (transport) => {
            console.log(`Socket transport upgraded to ${transport.name}`);
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
