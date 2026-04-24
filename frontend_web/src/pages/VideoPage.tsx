import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../hooks/useSocket';

const VideoPage = () => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    
    // Стукаємо в сокет відео-сигналінгу
    const { messages, sendMessage, isConnected } = useSocket('video');

    const configuration = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };

    // 1. Ініціалізація з'єднання
    const setupPeerConnection = () => {
        const pc = new RTCPeerConnection(configuration);

        // Обробка ICE-кандидатів (шляхи через NAT)
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendMessage({ type: 'candidate', candidate: event.candidate });
            }
        };

        // Коли приходить віддалений потік
        pc.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        peerConnection.current = pc;
        return pc;
    };

    // 2. Старт дзвінка (Offer)
    const startCall = async () => {
        const pc = setupPeerConnection();
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        sendMessage({ type: 'offer', offer });
    };

    // 3. Обробка вхідних сигналів з сокета
    useEffect(() => {
        const handleSignaling = async () => {
            const lastMsg = messages[messages.length - 1];
            if (!lastMsg || !peerConnection.current && lastMsg.type !== 'offer') return;

            if (lastMsg.type === 'offer') {
                const pc = setupPeerConnection();
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;
                stream.getTracks().forEach(track => pc.addTrack(track, stream));

                await pc.setRemoteDescription(new RTCSessionDescription(lastMsg.offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                sendMessage({ type: 'answer', answer });

            } else if (lastMsg.type === 'answer') {
                await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(lastMsg.answer));
            } else if (lastMsg.type === 'candidate') {
                await peerConnection.current?.addIceCandidate(new RTCIceCandidate(lastMsg.candidate));
            }
        };

        handleSignaling();
    }, [messages]);

    return (
        <div style={{ padding: '20px', background: '#121212', color: '#fff', minHeight: '100vh' }}>
            <div style={{ 
                padding: '10px', background: isConnected ? '#00d1b2' : '#ff3860', 
                textAlign: 'center', borderRadius: '5px', marginBottom: '20px' 
            }}>
                {isConnected ? "СИГНАЛІНГ ЖИВИЙ" : "НЕМАЄ ЗВ'ЯЗКУ"}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', borderRadius: '10px', background: '#000' }} />
                <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '10px', background: '#000' }} />
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button onClick={startCall} style={{ padding: '15px 30px', background: '#00D1B2', border: 'none', borderRadius: '5px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                    ДЗВОНИТИ
                </button>
            </div>
        </div>
    );
};

export default VideoPage;