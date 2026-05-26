import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface VoiceContextProps {
  joinVoice: (roomId: string) => void;
  leaveVoice: () => void;
  toggleMic: () => void;
  toggleCam: () => void;
  isMicMuted: boolean;
  isCamMuted: boolean;
  localStream: MediaStream | null;
  remoteStreams: Record<string, MediaStream>; // Зберігаємо стріми інших юзерів по їх ID
  currentRoom: string | null;
}

const VoiceContext = createContext<VoiceContextProps | null>(null);

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

export const VoiceProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamMuted, setIsCamMuted] = useState(true); // Камера по дефолту вимкнена

  const peersRef = useRef<Record<string, RTCPeerConnection>>({});
  const localStreamRef = useRef<MediaStream | null>(null);

  // 1. Ініціалізація сокету для войсу
  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('all_voice_users', (users) => {
      users.forEach((userId: string) => {
        const peer = createPeer(userId, newSocket.id!, localStreamRef.current!);
        peersRef.current[userId] = peer;
      });
    });

    newSocket.on('user_joined', async (payload) => {
      const peer = addPeer(payload.signal, payload.callerID, localStreamRef.current!, newSocket);
      peersRef.current[payload.callerID] = peer;
    });

    newSocket.on('receiving_returned_signal', async (payload) => {
      const item = peersRef.current[payload.id];
      if (item) await item.setRemoteDescription(new RTCSessionDescription(payload.signal));
    });

    newSocket.on('ice_candidate', async (payload) => {
      const peer = peersRef.current[payload.sender];
      if (peer && payload.candidate) {
        await peer.addIceCandidate(new RTCIceCandidate(payload.candidate)).catch(e => console.error(e));
      }
    });

    newSocket.on('user_left', (userId) => {
      if (peersRef.current[userId]) {
        peersRef.current[userId].close();
        delete peersRef.current[userId];
      }
      setRemoteStreams(prev => {
        const newStreams = { ...prev };
        delete newStreams[userId];
        return newStreams;
      });
    });

    return () => { newSocket.disconnect(); };
  }, []);

  // 2. Створення з'єднання (Ініціатор дзвінка)
  const createPeer = (userToSignal: string, callerID: string, stream: MediaStream) => {
    const peer = new RTCPeerConnection(ICE_SERVERS);
    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    peer.onicecandidate = (e) => {
      if (e.candidate) socket?.emit('ice_candidate', { target: userToSignal, candidate: e.candidate });
    };

    peer.ontrack = (e) => {
      setRemoteStreams(prev => ({ ...prev, [userToSignal]: e.streams[0] }));
    };

    peer.onnegotiationneeded = async () => {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket?.emit('sending_signal', { userToSignal, callerID, signal: peer.localDescription });
    };

    return peer;
  };

  // 3. Прийняття з'єднання (Відповідач)
  const addPeer = (incomingSignal: RTCSessionDescriptionInit, callerID: string, stream: MediaStream, currentSocket: Socket) => {
    const peer = new RTCPeerConnection(ICE_SERVERS);
    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    peer.onicecandidate = (e) => {
      if (e.candidate) currentSocket.emit('ice_candidate', { target: callerID, candidate: e.candidate });
    };

    peer.ontrack = (e) => {
      setRemoteStreams(prev => ({ ...prev, [callerID]: e.streams[0] }));
    };

    peer.setRemoteDescription(new RTCSessionDescription(incomingSignal)).then(async () => {
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      currentSocket.emit('returning_signal', { signal: peer.localDescription, callerID });
    });

    return peer;
  };

  // 4. ЕКШНИ КОРИСТУВАЧА
  const joinVoice = async (roomId: string) => {
    console.log(`[VOICE] 1. Клік пройшов. Спроба входу в кімнату: ${roomId}`);
    
    // Перевіряємо, чи браузер взагалі підтримує WebRTC в поточному середовищі
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('[VOICE] FATAL: Браузер не підтримує mediaDevices. Можливо, ти відкрив не через localhost або заблокував доступ.');
      alert('Помилка: Ваш браузер блокує доступ до камери/мікрофона.');
      return;
    }

    try {
      console.log('[VOICE] 2. Запитуємо доступ до камери та мікрофона...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      
      console.log('[VOICE] 3. Доступ отримано! Налаштовуємо стрім.');
      stream.getVideoTracks().forEach(track => track.enabled = false);
      
      setLocalStream(stream);
      localStreamRef.current = stream;
      setCurrentRoom(roomId);
      
      console.log(`[VOICE] 4. Стейт оновлено. Відправляємо сокет join_voice: ${roomId}`);
      socket?.emit('join_voice', roomId);
    } catch (err: any) {
      console.error('[VOICE] ERROR: Не вдалося отримати доступ до мікрофона/камери.', err.name, err.message);
      alert(`Помилка доступу до пристроїв: ${err.message}`);
    }
  };

  const leaveVoice = () => {
    socket?.emit('leave_voice', currentRoom);
    setCurrentRoom(null);
    
    // Вимикаємо свої треки (щоб лампочка камери погасла)
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    setLocalStream(null);
    localStreamRef.current = null;
    
    // Закриваємо всі з'єднання
    Object.values(peersRef.current).forEach(peer => peer.close());
    peersRef.current = {};
    setRemoteStreams({});
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleCam = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCamMuted(!videoTrack.enabled);
      }
    }
  };

  return (
    <VoiceContext.Provider value={{
      joinVoice, leaveVoice, toggleMic, toggleCam, 
      isMicMuted, isCamMuted, localStream, remoteStreams, currentRoom
    }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) throw new Error('useVoice must be used within a VoiceProvider');
  return context;
};