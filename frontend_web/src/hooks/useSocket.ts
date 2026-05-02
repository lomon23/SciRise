import { useEffect, useRef, useState } from 'react';
import { use_auth_store } from '../store/authStore';

export const useSocket = (urlPath: string) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);
    const token = use_auth_store((state) => state.access_token);

    useEffect(() => {
        // Якщо токена немає - навіть не намагаємось підключитись
        if (!token) return;

        const baseUrl = import.meta.env.VITE_WS_URL.replace(/\/$/, ""); 
        const cleanPath = urlPath ? `/${urlPath.replace(/^\//, "")}` : "";
        const socketUrl = `${baseUrl}${cleanPath}/?token=${token}`;
        
        socketRef.current = new WebSocket(socketUrl);

        socketRef.current.onopen = () => setIsConnected(true);
        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);
        };
        socketRef.current.onclose = () => setIsConnected(false);

        return () => {
            socketRef.current?.close();
        };
    }, [urlPath, token]);

    const sendMessage = (message: any) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
        }
    };

    return { messages, sendMessage, isConnected };
};