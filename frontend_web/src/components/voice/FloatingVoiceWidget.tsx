import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVoice } from '../../pages/voice/VoiceContext';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Expand } from 'lucide-react';
import './FloatingVoiceWidget.scss';

export const FloatingVoiceWidget = () => {
  const { currentRoom, toggleMic, toggleCam, isMicMuted, isCamMuted, leaveVoice } = useVoice();
  const location = useLocation();
  const navigate = useNavigate();
  const groupId = location.pathname.split('/')[3];

  const [pos, setPos] = useState({ x: window.innerWidth - 260, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  if (!currentRoom || location.pathname.includes(`/voice/${currentRoom}`)) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
  };

  return (
    <div 
      className="voice-widget" 
      style={{ left: pos.x, top: pos.y }}
      onPointerMove={handlePointerMove}
      onPointerUp={() => setIsDragging(false)}
      onPointerLeave={() => setIsDragging(false)}
    >
      <div className="voice-widget__header" onPointerDown={handlePointerDown}>
        <span className="voice-widget__title">● АКТИВНИЙ ВОЙС</span>
        <button className="voice-widget__expand" onClick={() => navigate(`/workspace/groups/${groupId}/voice/${currentRoom}`)}>
          <Expand size={12} />
        </button>
      </div>
      
      <div className="voice-widget__controls">
        <button className={isMicMuted ? 'btn-ctrl muted' : 'btn-ctrl'} onClick={toggleMic}>
          {isMicMuted ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
        <button className={isCamMuted ? 'btn-ctrl muted' : 'btn-ctrl'} onClick={toggleCam}>
          {isCamMuted ? <VideoOff size={18} /> : <Video size={18} />}
        </button>
        <button className="btn-ctrl disconnect" onClick={leaveVoice}>
          <PhoneOff size={18} />
        </button>
      </div>
    </div>
  );
};