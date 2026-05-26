import { useState, useRef } from 'react';
import { useLocation, useNavigate,  } from 'react-router-dom';
import { useVoice } from '../../pages/voice/VoiceContext';
// ПЕРЕВІР ЧИ ПРАВИЛЬНИЙ ШЛЯХ ДО CSS, БО НА СКРІНІ ВІН НЕ ПРАЦЮЄ:
import './FloatingVoiceWidget.scss';

export const FloatingVoiceWidget = () => {
  const { currentRoom, toggleMic, toggleCam, isMicMuted, isCamMuted, leaveVoice } = useVoice();
  const location = useLocation();
  const navigate = useNavigate();
  // Витягуємо groupId з URL, щоб знати, куди розгортати
  const groupId = location.pathname.split('/')[3]; 

  // Стан для перетягування
  const [position, setPosition] = useState({ x: window.innerWidth - 320, y: window.innerHeight - 200 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // 1. Якщо юзер не у войсі - ховаємо
  if (!currentRoom) return null;

  // 2. Якщо юзер зараз на ПОВНОФОРМАТНІЙ сторінці войсу - ховаємо віджет!
  const isVoiceRoute = location.pathname.includes(`/voice/${currentRoom}`);
  if (isVoiceRoute) return null;

  // Логіка перетягування...
  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    let newX = e.clientX - dragOffset.current.x;
    let newY = e.clientY - dragOffset.current.y;
    newX = Math.max(260, Math.min(newX, window.innerWidth - 200));
    newY = Math.max(0, Math.min(newY, window.innerHeight - 100));
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div 
      className="floating-voice-widget"
      style={{ left: position.x, top: position.y }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="voice-header" onPointerDown={handlePointerDown}>
        <span>🔊 Войс активний</span>
        <button onClick={() => navigate(`/workspace/groups/${groupId}/voice/${currentRoom}`)}>
          ↖ Розгорнути
        </button>
      </div>
      
      {/* У міні-віджеті можна не рендерити самі відео, щоб не жерти ресурси, 
          або відрендерити тільки твій VideoPlayer */}

      <div className="voice-controls" onPointerDown={(e) => e.stopPropagation()}>
        <button className={isMicMuted ? 'muted' : ''} onClick={toggleMic}>
          {isMicMuted ? '🔇' : '🎙️'}
        </button>
        <button className={isCamMuted ? 'muted' : ''} onClick={toggleCam}>
          {isCamMuted ? '📷❌' : '📷'}
        </button>
        <button className="disconnect-btn" onClick={leaveVoice}>
          📞
        </button>
      </div>
    </div>
  );
};