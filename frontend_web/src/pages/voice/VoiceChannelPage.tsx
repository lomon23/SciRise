import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVoice } from './VoiceContext';
 // Стилі зробиш під себе (великий чорний екран)
import './VoiceChannelPage.scss';
// Допоміжний компонент для відео
const VideoPlayer = ({ stream, isLocal, isMuted }: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);
  return (
    <div className="voice-page-video-wrapper">
      <video ref={videoRef} autoPlay playsInline muted={isLocal} className={isMuted ? 'muted' : ''} />
      {isMuted && <div className="overlay">Камера вимкнена</div>}
    </div>
  );
};

export const VoiceChannelPage = () => {
  const { groupId, channelId } = useParams();
  const navigate = useNavigate();
  const { joinVoice, leaveVoice, currentRoom, localStream, remoteStreams, toggleMic, toggleCam, isMicMuted, isCamMuted } = useVoice();

  // При відкритті сторінки - підключаємось, якщо ще не там
  useEffect(() => {
    if (channelId && currentRoom !== channelId) {
      joinVoice(channelId);
    }
  }, [channelId]);

  const remoteUsers = Object.keys(remoteStreams);

  const handleMinimize = () => {
    // Просто переходимо на дошку (або куди завгодно), віджет з'явиться сам
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
        <button className="minimize-btn" onClick={handleMinimize}>↘ Згорнути у віджет</button>
      </div>

      <div className="voice-page-grid">
        {localStream && <VideoPlayer stream={localStream} isLocal={true} isMuted={isCamMuted} />}
        {remoteUsers.map(userId => (
          <VideoPlayer key={userId} stream={remoteStreams[userId]} />
        ))}
      </div>

      <div className="voice-page-controls">
        <button className={isMicMuted ? 'muted' : ''} onClick={toggleMic}>
          {isMicMuted ? '🔇 Мікрофон вимкнено' : '🎙️ Мікрофон увімкнено'}
        </button>
        <button className={isCamMuted ? 'muted' : ''} onClick={toggleCam}>
          {isCamMuted ? '📷❌ Камера вимкнена' : '📷 Камера увімкнена'}
        </button>
        <button className="disconnect" onClick={handleDisconnect}>📞 Відключитись</button>
      </div>
    </div>
  );
};