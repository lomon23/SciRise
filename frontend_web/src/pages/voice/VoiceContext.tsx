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
  remoteStreams: Record<string, MediaStream>; 
  connectedUsers: string[]; // Масив для відмальовки сітки екранів
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
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamMuted, setIsCamMuted] = useState(true);

  const peersRef = useRef<Record<string, RTCPeerConnection>>({});
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // 1. Отримуємо список тих, хто ВЖЕ в кімнаті (спрацьовує для того, хто щойно зайшов)
    newSocket.on('all_voice_users', (users: string[]) => {
      setConnectedUsers(users);
      users.forEach((userId: string) => {
        const peer = createPeer(userId, newSocket.id!, localStreamRef.current);
        peersRef.current[userId] = peer;
      });
    });

    // 2. Хтось новий зайшов (спрацьовує для тих, хто вже сидить у кімнаті)
    newSocket.on('user_joined', async (payload) => {
      setConnectedUsers(prev => {
        if (prev.includes(payload.callerID)) return prev;
        return [...prev, payload.callerID];
      });

      const peer = addPeer(payload.signal, payload.callerID, localStreamRef.current, newSocket);
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
      setConnectedUsers(prev => prev.filter(id => id !== userId));
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

  // Створення з'єднання (Ініціатор дзвінка)
  const createPeer = (userToSignal: string, callerID: string, stream: MediaStream | null) => {
    const peer = new RTCPeerConnection(ICE_SERVERS);
    
    // Додаємо треки ТІЛЬКИ якщо вони є
    if (stream) {
      stream.getTracks().forEach(track => peer.addTrack(track, stream));
    }

    peer.onicecandidate = (e) => {
      if (e.candidate) socket?.emit('ice_candidate', { target: userToSignal, candidate: e.candidate });
    };

    peer.ontrack = (e) => {
      setRemoteStreams(prev => ({ ...prev, [userToSignal]: e.streams[0] }));
    };

    // ГОЛОВНИЙ ФІКС: Примусово створюємо Offer. Не чекаємо на onnegotiationneeded!
    // Тепер сигнал піде в будь-якому випадку, навіть якщо камера відвалилася або зайнята.
    peer.createOffer().then(offer => {
      peer.setLocalDescription(offer);
      socket?.emit('sending_signal', { userToSignal, callerID, signal: offer });
    });

    return peer;
  };

  // Прийняття з'єднання (Відповідач)
  const addPeer = (incomingSignal: RTCSessionDescriptionInit, callerID: string, stream: MediaStream | null, currentSocket: Socket) => {
    const peer = new RTCPeerConnection(ICE_SERVERS);
    
    if (stream) {
      stream.getTracks().forEach(track => peer.addTrack(track, stream));
    }

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

  const joinVoice = async (roomId: string) => {
    try {
      // Пробуємо захопити камеру. Якщо ми в другій вкладці і вона зайнята - це викине помилку
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      stream.getVideoTracks().forEach(track => track.enabled = false);
      
      setLocalStream(stream);
      localStreamRef.current = stream;
    } catch (err: any) {
      console.warn('Камера/мікрофон зайняті або заблоковані. Підключаємось як слухач.');
      // Ми навмисно не перериваємо виконання (return), щоб юзер все одно зайшов у кімнату
      setLocalStream(null);
      localStreamRef.current = null;
    }

    // Незалежно від того, чи є в нас камера, ми кажемо серверу, що зайшли
    setCurrentRoom(roomId);
    socket?.emit('join_voice', roomId);
  };

  const leaveVoice = () => {
    socket?.emit('leave_voice', currentRoom);
    setCurrentRoom(null);
    setConnectedUsers([]);
    
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    setLocalStream(null);
    localStreamRef.current = null;
    
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
      isMicMuted, isCamMuted, localStream, remoteStreams, connectedUsers, currentRoom
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