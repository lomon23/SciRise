import { useState, useEffect, useCallback} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ContextNavButton } from '../../ui/sidebar-ui/ContextNavButton';
import { CreateGroupModal } from './CreateGroupModal';
import { settingsMenu } from '../../../config/navigation';
import { axiosInstance } from '../../../api/axios';
import { AttachCourseModal } from './AttachCourseModal';
import './ContextSidebar.scss';

// Типізація під те, що віддає наш Django (GroupSerializer)
interface Channel {
  id: number;
  name: string;
  channel_type: 'TEXT' | 'VOICE' | 'BOARD';
}
interface CourseLite {
  id: number;
  title: string;
}
interface Group {
  id: number;
  name: string;
  channels: Channel[];
  courses: CourseLite[]; // <-- Додали масив курсів
}

export const ContextSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // <-- Стейт модалки
  const [attachModalGroupId, setAttachModalGroupId] = useState<number | null>(null);

  // Винесли фетч в окрему функцію
  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/groups/');
      setGroups(response.data);
    } catch (error) {
      console.error('Помилка завантаження груп:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/workspace/groups')) {
      fetchGroups();
    }
  }, [location.pathname, fetchGroups]);
  const renderContent = () => {
    if (location.pathname.startsWith('/workspace/settings')) {
      return (
        <>
          <div className="context-sidebar__header">
            <h3>Налаштування</h3>
          </div>
          <div className="context-sidebar__channels">
            {settingsMenu.map((item) => (
              <ContextNavButton
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              />
            ))}
          </div>
        </>
      );
    }

    if (location.pathname.startsWith('/workspace/groups')) {
      return (
        <>
          <div className="context-sidebar__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Мої Групи</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* НОВА КНОПКА ПРИЄДНАННЯ */}
              <button 
                onClick={async () => {
                  const groupId = window.prompt('Введіть ID групи, щоб приєднатися:');
                  if (!groupId) return;
                  
                  try {
                    await axiosInstance.post(`/groups/${groupId}/join/`);
                    fetchGroups(); // Оновлюємо сайдбар - нова група з'явиться миттєво
                  } catch (error: any) {
                    alert(error.response?.data?.error || 'Помилка приєднання. Перевірте ID.');
                  }
                }}
                style={{ background: '#3b82f6', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '12px', padding: '4px 8px', borderRadius: '4px' }} 
                title="Приєднатися за ID"
              >
                Ввійти
              </button>
              
              {/* СТАРА КНОПКА СТВОРЕННЯ */}
              <button 
                onClick={() => setIsModalOpen(true)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '20px' }} 
                title="Створити групу"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="context-sidebar__channels">
            {/* ... (блок рендеру loading і мапування груп без змін) */}
            {loading ? (
              <div style={{ color: '#94a3b8', padding: '12px' }}>Завантаження...</div>
            ) : groups.length === 0 ? (
              <div style={{ color: '#94a3b8', padding: '12px', fontSize: '14px' }}>У вас ще немає груп</div>
            ) : (
              groups.map((group) => (
                <div key={group.id} className="group-block" style={{ marginBottom: '24px' }}>
                  <div className="group-title" style={{ fontSize: '14px', color: '#f8fafc', padding: '0 12px 8px', fontWeight: 600 }}>
                    {group.name}
                  </div>
                  
                  {/* Блок Каналів */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', padding: '0 12px 4px' }}>Канали</div>
                    {group.channels.map((channel) => {
                      const icon = channel.channel_type === 'TEXT' ? '#' : channel.channel_type === 'BOARD' ? '🎨' : '🔊';
                      const path = `/workspace/groups/${group.id}/channels/${channel.id}`;
                      return (
                        <ContextNavButton
                          key={channel.id}
                          icon={icon}
                          label={channel.name}
                          isActive={location.pathname === path}
                          onClick={() => navigate(path)}
                        />
                      );
                    })}
                  </div>

                  {/* Блок Курсів */}
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', padding: '0 12px 4px', display: 'flex', justifyContent: 'space-between' }}>
                      Курси
                      <span 
                        style={{ cursor: 'pointer', color: '#94a3b8' }} 
                        title="Прикріпити курс"
                        onClick={() => setAttachModalGroupId(group.id)} // <-- Відкриваємо модалку для конкретної групи
                      >
                        +
                      </span>
                    </div>
                    {group.courses && group.courses.length > 0 ? (
                      group.courses.map(course => {
                        const path = `/workspace/groups/${group.id}/courses/${course.id}`;
                        return (
                          <ContextNavButton
                            key={course.id}
                            icon="📚"
                            label={course.title}
                            isActive={location.pathname === path}
                            onClick={() => navigate(path)}
                          />
                        )
                      })
                    ) : (
                      <div style={{ fontSize: '12px', color: '#475569', padding: '4px 12px' }}>Немає курсів</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      );
    }
    if (location.pathname.startsWith('/workspace/courses')) {
      return (
        <>
          <div className="context-sidebar__header">
            <h3>Курси</h3>
          </div>
          <div className="context-sidebar__channels">
            <ContextNavButton
              icon="🌍"
              label="Стрічка курсів"
              isActive={location.pathname === '/workspace/courses/feed'}
              onClick={() => navigate('/workspace/courses/feed')}
            />
            <ContextNavButton
              icon="📚"
              label="Мої курси"
              isActive={location.pathname === '/workspace/courses/my'}
              onClick={() => navigate('/workspace/courses/my')}
            />
          </div>
        </>
      );
    }
    return null; 
  };

  return (
    <aside className="context-sidebar">
      {renderContent()}
      
      {/* Рендеримо модалку поверх усього, якщо стейт true */}
      {isModalOpen && (
        <CreateGroupModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false); // Закриваємо
            fetchGroups();         // Миттєво перемальовуємо сайдбар
          }} 
        />
      )}
      {attachModalGroupId && (
        <AttachCourseModal
          groupId={attachModalGroupId}
          onClose={() => setAttachModalGroupId(null)}
          onSuccess={() => {
            setAttachModalGroupId(null);
            fetchGroups(); // Оновлюємо сайдбар, щоб з'явився прикріплений курс
          }}
        />
      )}
    </aside>
  );
};