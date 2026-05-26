import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, Eye, Edit3, Minus, X } from 'lucide-react';
import './Widgets.scss';

export const TextWidget = ({ widget, onUpdate, onHide, onDelete }: any) => {
  const [text, setText] = useState(widget.content?.text || '');
  const [isPreview, setIsPreview] = useState(false);

  const handleBlur = () => {
    onUpdate(widget.id, { ...widget.content, text });
  };

  const handleClose = () => {
    if (text.trim()) {
      const wantToSave = window.confirm('Зберегти нотатку як .md файл перед видаленням?');
      if (wantToSave) {
        const blob = new Blob([text], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `note_${widget.id}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }
    onDelete();
  };

  return (
    <div className="widget-inner">
      <div className="widget-header">
        <div className="header-left">
          <FileText size={16} className="widget-icon" />
          <span>Нотатка</span>
          <button className="widget-mode-btn" onClick={() => setIsPreview(!isPreview)}>
            {isPreview ? <><Edit3 size={12} /> Редагувати</> : <><Eye size={12} /> Перегляд</>}
          </button>
        </div>
        <div className="header-actions">
          <button className="widget-btn hide-btn" onClick={onHide} title="Згорнути"><Minus size={14} /></button>
          <button className="widget-btn close-btn" onClick={handleClose} title="Закрити повністю"><X size={14} /></button>
        </div>
      </div>
      
      <div className="widget-body" onPointerDown={(e) => e.stopPropagation()}>
        {isPreview ? (
          <div className="markdown-container widget-markdown-view">
            <ReactMarkdown>{text || '*Порожньо*'}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            className="text-widget-input"
            placeholder="Пишіть у форматі Markdown..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            spellCheck="false"
          />
        )}
      </div>
    </div>
  );
};