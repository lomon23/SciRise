import { useState } from 'react';
import { MonitorPlay, Minus, X } from 'lucide-react'; // Змінили імпорт
import './Widgets.scss';

export const VideoWidget = ({ widget, onUpdate, onHide, onDelete }: any) => {
  const [urlInput, setUrlInput] = useState('');
  const savedUrl = widget.content?.url;

  const getEmbedUrl = (url: string) => {
    try {
      const videoId = url.split('v=')[1]?.split('&')[0] || url.split('youtu.be/')[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch { return null; }
  };

  const handleSaveUrl = () => {
    if (urlInput) onUpdate(widget.id, { ...widget.content, url: urlInput });
  };

  return (
    <div className="widget-inner">
      <div className="widget-header">
        <div className="header-left">
          <MonitorPlay size={16} className="widget-icon" /> {/* Замінили іконку */}
          <span>Відео</span>
        </div>
        <div className="header-actions">
          <button className="widget-btn hide-btn" onClick={onHide} title="Згорнути"><Minus size={14} /></button>
          <button className="widget-btn close-btn" onClick={onDelete} title="Закрити повністю"><X size={14} /></button>
        </div>
      </div>

      <div className="widget-body" onPointerDown={(e) => e.stopPropagation()}>
        {!savedUrl ? (
          <div className="widget-setup video-widget-setup">
            <input 
              type="text" 
              placeholder="Вставте посилання на відео..." 
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <button onClick={handleSaveUrl}>Прив'язати відео</button>
          </div>
        ) : (
          <iframe
            className="video-widget-iframe"
            src={getEmbedUrl(savedUrl) || ''}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </div>
    </div>
  );
};