import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Maximize2 } from 'lucide-react';
import { useVoice } from './VoiceContext';
import './VoiceChannelPage.scss';

const VideoPlayer = ({ stream, isLocal, isMuted }: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className="voice-page-video-wrapper">
      <video ref={videoRef} autoPlay playsInline muted={isLocal} className={isMuted ? 'muted' : ''} />
      
      {/* Якщо isMuted == true АБО стріму взагалі немає — малюємо заглушку */}
      {(isMuted || !stream) && (
        <div className="overlay">
          <div className="overlay-glow"></div>
          <span className="overlay-text">Камера вимкнена</span>
        </div>
      )}
    </div>
  );
};

export const VoiceChannelPage = () => {
  const { groupId, channelId } = useParams();
  const navigate = useNavigate();
  const { 
    joinVoice, leaveVoice, currentRoom, localStream, 
    remoteStreams, connectedUsers, toggleMic, toggleCam, 
    isMicMuted, isCamMuted 
  } = useVoice();

  useEffect(() => {
    if (channelId && currentRoom !== channelId) {
      joinVoice(channelId);
    }
  }, [channelId]);

  const handleMinimize = () => {
    navigate(`/workspace/groups/${groupId}/board`);
  };

  const handleDisconnect = () => {
    leaveVoice();
    navigate(`/workspace/groups/${groupId}/board`);
  };

  return (
    <div className="voice-channel-page">
      <div className="voice-page-header">
        <h2>Голосовий канал #{channelId}</h2>
        <button className="icon-btn" onClick={handleMinimize} title="Згорнути у віджет">
          <Maximize2 size={20} />
        </button>
      </div>

      <div className="voice-page-grid">
        {/* 1. Локальний користувач */}
        {localStream && <VideoPlayer stream={localStream} isLocal={true} isMuted={isCamMuted} />}
        
        {/* 2. Інші користувачі (базується на інфі з сокетів) */}
        {connectedUsers.map(userId => (
          <VideoPlayer 
            key={userId} 
            stream={remoteStreams[userId]} // Може бути undefined, якщо WebRTC не зміг
            isMuted={!remoteStreams[userId]} // Примусово показуємо заглушку, якщо стріму нема
          />
        ))}
      </div>

      <div className="voice-page-controls">
        <button className={`control-btn ${isMicMuted ? 'muted' : ''}`} onClick={toggleMic} title="Мікрофон">
          {isMicMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        
        <button className={`control-btn ${isCamMuted ? 'muted' : ''}`} onClick={toggleCam} title="Камера">
          {isCamMuted ? <VideoOff size={24} /> : <Video size={24} />}
        </button>
        
        <button className="control-btn disconnect" onClick={handleDisconnect} title="Відключитись">
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
};