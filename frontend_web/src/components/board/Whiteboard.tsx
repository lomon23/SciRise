import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { axiosInstance } from '../../api/axios';
import { TextWidget } from './widgets/TextWidget';
import { VideoWidget } from './widgets/VideoWidget';
import { CourseWidget } from './widgets/CourseWidget';
import './Whiteboard.scss';

export interface WidgetData {
  id: number;
  widget_type: 'course' | 'text' | 'video';
  x: number;
  y: number;
  width: number;
  height: number;
  z_index: number;
  content: any;
}

export const Whiteboard = () => {
  const { groupId } = useParams();
  const [widgets, setWidgets] = useState<WidgetData[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const [resizingId, setResizingId] = useState<number | null>(null);
  const resizeStart = useRef({ width: 0, height: 0, startX: 0, startY: 0 });

  // 1. РОБИМО РЕФ МИТТЄВИМ (без useEffect). 
  // Він завжди має актуальні дані прямо в момент рендеру.
  const widgetsRef = useRef<WidgetData[]>([]);
  widgetsRef.current = widgets;

  useEffect(() => {
    if (!groupId) return;
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);
    newSocket.emit('join_board', groupId);

    const fetchWidgets = async () => {
      try {
        const response = await axiosInstance.get(`/groups/${groupId}/widgets/`);
        setWidgets(response.data);
      } catch (error) {
        console.error('Помилка завантаження дошки:', error);
      }
    };
    fetchWidgets();

    newSocket.on('widget_moved', (updatedWidget: WidgetData) => {
      setWidgets(prev => prev.map(w => w.id === updatedWidget.id ? updatedWidget : w));
    });

    newSocket.on('widget_updated', (updatedWidget: WidgetData) => {
      setWidgets(prev => {
        const exists = prev.find(w => w.id === updatedWidget.id);
        if (exists) return prev.map(w => w.id === updatedWidget.id ? updatedWidget : w);
        return [...prev, updatedWidget];
      });
    });
    newSocket.on('widget_deleted', (data: any) => {
      // Залежно від того, як твій Node-сервер пересилає дані, 
      // витягуємо ID (може прийти об'єкт {widgetId: ...} або просто число)
      const idToRemove = typeof data === 'object' ? data.widgetId : data;
      setWidgets(prev => prev.filter(w => w.id !== idToRemove));
    });
    return () => { newSocket.disconnect(); };
  }, [groupId]);

  const handleAddWidget = async (type: 'text' | 'video' | 'course') => {
    try {
      const response = await axiosInstance.post(`/groups/${groupId}/widgets/`, {
        widget_type: type,
        x: 50, y: 50,
        width: type === 'text' ? 250 : 350,
        height: type === 'text' ? 150 : 250,
        z_index: widgets.length + 1,
        content: type === 'text' ? { text: 'Новий запис...', hidden: false } : { hidden: false }
      });
      setWidgets(prev => [...prev, response.data]);
      socket?.emit('widget_saved', { groupId, widget: response.data });
    } catch (error) {
      console.error('Не вдалося створити віджет', error);
    }
  };

  const handleUpdateContent = async (widgetId: number, newContent: any) => {
    try {
      await axiosInstance.patch(`/widgets/${widgetId}/`, { content: newContent });
      const updatedWidgets = widgets.map(w => w.id === widgetId ? { ...w, content: newContent } : w);
      setWidgets(updatedWidgets);
      
      const updatedWidget = updatedWidgets.find(w => w.id === widgetId);
      if (updatedWidget) socket?.emit('widget_saved', { groupId, widget: updatedWidget });
    } catch (error) {
      console.error('Помилка оновлення контенту', error);
    }
  };

  const handleToggleHide = (widgetId: number, isHidden: boolean) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      handleUpdateContent(widgetId, { ...widget.content, hidden: isHidden });
    }
  };
  const handleDeleteWidget = async (widgetId: number) => {
    try {
      await axiosInstance.delete(`/widgets/${widgetId}/`);
      setWidgets(prev => prev.filter(w => w.id !== widgetId));
      socket?.emit('widget_deleted', { groupId, widgetId });
    } catch (error) {
      console.error('Помилка видалення віджета', error);
    }
  };
  const handlePointerDownDrag = (e: React.PointerEvent, widget: WidgetData) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setDraggingId(widget.id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerDownResize = (e: React.PointerEvent, widget: WidgetData) => {
    e.stopPropagation();
    setResizingId(widget.id);
    resizeStart.current = { width: widget.width, height: widget.height, startX: e.clientX, startY: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingId !== null) {
      const boardRect = e.currentTarget.getBoundingClientRect();
      const newX = e.clientX - boardRect.left - dragOffset.current.x;
      const newY = e.clientY - boardRect.top - dragOffset.current.y;

      const currentWidget = widgetsRef.current.find(w => w.id === draggingId);
      if (!currentWidget) return;

      const updatedWidget = { ...currentWidget, x: newX, y: newY };
      socket?.emit('widget_moving', { groupId, widget: updatedWidget });
      setWidgets(prev => prev.map(w => w.id === draggingId ? updatedWidget : w));

    } else if (resizingId !== null) {
      const dx = e.clientX - resizeStart.current.startX;
      const dy = e.clientY - resizeStart.current.startY;
      
      const currentWidget = widgetsRef.current.find(w => w.id === resizingId);
      if (!currentWidget) return;

      const updatedWidget = { 
        ...currentWidget, 
        width: Math.max(150, resizeStart.current.width + dx), 
        height: Math.max(100, resizeStart.current.height + dy) 
      };

      socket?.emit('widget_moving', { groupId, widget: updatedWidget });
      setWidgets(prev => prev.map(w => w.id === resizingId ? updatedWidget : w));
    }
  };

  const handlePointerUp = async (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    const activeId = draggingId || resizingId;
    
    if (activeId !== null) {
      // 2. ФІКС: Беремо актуальний віджет з РЕФА, а не зі старого стейту!
      const widgetToSave = widgetsRef.current.find(w => w.id === activeId);
      setDraggingId(null);
      setResizingId(null);

      if (widgetToSave) {
        try {
          await axiosInstance.patch(`/widgets/${widgetToSave.id}/`, {
            x: widgetToSave.x, y: widgetToSave.y,
            width: widgetToSave.width, height: widgetToSave.height
          });
          socket?.emit('widget_saved', { groupId, widget: widgetToSave });
        } catch (error) { console.error('Помилка збереження геометрії', error); }
      }
    }
  };

  return (
    <div className="whiteboard-container" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
      <div className="whiteboard-toolbar">
        <div className="toolbar-actions">
          <button onClick={() => handleAddWidget('text')}>+ Текст</button>
          <button onClick={() => handleAddWidget('video')}>+ Відео</button>
          <button onClick={() => handleAddWidget('course')}>+ Курс</button>
        </div>
        
        <div className="taskbar">
          {widgets.map(w => (
            <button 
              key={w.id} 
              className={`taskbar-tab ${w.content?.hidden ? 'tab-hidden' : 'tab-active'}`}
              onClick={() => handleToggleHide(w.id, !w.content?.hidden)}
            >
              {w.widget_type === 'text' ? '📝' : w.widget_type === 'video' ? '🎥' : '📚'} #{w.id}
            </button>
          ))}
        </div>
      </div>

      <div className="whiteboard-canvas">
        {widgets.filter(w => !w.content?.hidden).map(widget => (
          <div 
            key={widget.id}
            className="widget-placeholder"
            onPointerDown={(e) => handlePointerDownDrag(e, widget)}
            style={{
              transform: `translate(${widget.x}px, ${widget.y}px)`,
              width: `${widget.width}px`,
              height: `${widget.height}px`,
              zIndex: (widget.id === draggingId || widget.id === resizingId) ? 999 : widget.z_index,
              position: 'absolute',
              border: 'none',
              background: 'transparent',
              // Блокуємо івенти всередині віджета під час перетягування (щоб iframe ютуба не крав мишку)
              pointerEvents: (draggingId !== null || resizingId !== null) ? 'none' : 'auto'
            }}
          >
            <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
              {widget.widget_type === 'text' && (
                <TextWidget 
                  widget={widget} 
                  onUpdate={handleUpdateContent} 
                  onHide={() => handleToggleHide(widget.id, true)} 
                  onDelete={() => handleDeleteWidget(widget.id)} 
                />
              )}
              {widget.widget_type === 'video' && (
                <VideoWidget 
                  widget={widget} 
                  onUpdate={handleUpdateContent} 
                  onHide={() => handleToggleHide(widget.id, true)} 
                  onDelete={() => handleDeleteWidget(widget.id)} 
                />
              )}
              {widget.widget_type === 'course' && (
                <CourseWidget 
                  widget={widget} 
                  onUpdate={handleUpdateContent} 
                  onHide={() => handleToggleHide(widget.id, true)} 
                  onDelete={() => handleDeleteWidget(widget.id)} 
                />
              )}
            </div>
            
            <div className="resize-handle" onPointerDown={(e) => handlePointerDownResize(e, widget)} style={{ pointerEvents: 'auto' }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};