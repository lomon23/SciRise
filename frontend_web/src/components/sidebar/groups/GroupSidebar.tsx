import { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '../../../api/axios';
import { SecondSidebar } from '../core/SecondSidebar';
import { GroupItem } from './GroupItem';
import { CreateGroupModal } from '../../modals/groups/CreateGroupModal';
import { JoinGroupModal } from '../../modals/groups/JoinGroupModal';
import { AttachCourseModal } from '../../modals/groups/AttachCourseModal'; // Імпорт нової модалки
import './GroupSidebar.scss';

export const GroupSidebar = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Стейти для модалок груп
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // Стейт для модалки прикріплення курсу (зберігає ID групи або null)
  const [activeGroupIdForCourse, setActiveGroupIdForCourse] = useState<number | null>(null);

  // Дістаємо юзера з локал стореджа і перевіряємо роль
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isTutor = user?.role === 'tutor';

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
    fetchGroups();
  }, [fetchGroups]);

  // Замість старого алерта відкриваємо модалку прикріплення курсів
  const handleAttachCourseClick = (groupId: number) => {
    setActiveGroupIdForCourse(groupId);
  };

  const actionButtons = (
    <div className="group-sidebar__actions">
      <button className="btn-action" onClick={() => setIsJoinModalOpen(true)}>Ввійти</button>
      {isTutor && (
        <button className="btn-action" onClick={() => setIsCreateModalOpen(true)}>+</button>
      )}
    </div>
  );

  return (
    <>
      <SecondSidebar title="Мої Групи" actions={actionButtons}>
        <div className="group-sidebar__list">
          {loading ? (
            <div className="group-sidebar__status">...</div>
          ) : groups.length === 0 ? (
            <div className="group-sidebar__status">У вас ще немає груп</div>
          ) : (
            groups.map((group) => (
              <GroupItem
                key={group.id}
                group={group}
                onAddCourseClick={handleAttachCourseClick}
              />
            ))
          )}
        </div>
      </SecondSidebar>

      {isCreateModalOpen && (
        <CreateGroupModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSuccess={() => {
            setIsCreateModalOpen(false);
            fetchGroups();
          }} 
        />
      )}

      {isJoinModalOpen && (
        <JoinGroupModal 
          onClose={() => setIsJoinModalOpen(false)} 
          onSuccess={() => {
            setIsJoinModalOpen(false);
            fetchGroups();
          }} 
        />
      )}

      {/* Якщо стейт містить число (ID групи) — рендеримо модалку прикріплення */}
      {activeGroupIdForCourse !== null && (
        <AttachCourseModal
          groupId={activeGroupIdForCourse}
          onClose={() => setActiveGroupIdForCourse(null)}
          onSuccess={() => {
            setActiveGroupIdForCourse(null);
            fetchGroups(); // Оновлюємо, якщо потрібно побачити зміни контенту групи
          }}
        />
      )}
    </>
  );
};