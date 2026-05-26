import { useState, useEffect, useCallback } from 'react';
import { LogIn, Plus } from 'lucide-react'; // Додав іконки
import { axiosInstance } from '../../../api/axios';
import { SecondSidebar } from '../core/SecondSidebar';
import { GroupItem } from './GroupItem';
import { CreateGroupModal } from '../../modals/groups/CreateGroupModal';
import { JoinGroupModal } from '../../modals/groups/JoinGroupModal';
import { AttachCourseModal } from '../../modals/groups/AttachCourseModal';
import './GroupSidebar.scss';

export const GroupSidebar = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [activeGroupIdForCourse, setActiveGroupIdForCourse] = useState<number | null>(null);

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

  const handleAttachCourseClick = (groupId: number) => {
    setActiveGroupIdForCourse(groupId);
  };

  const actionButtons = (
    <div className="group-sidebar__actions">
      <button className="btn-action" onClick={() => setIsJoinModalOpen(true)} title="Приєднатися">
        <LogIn size={18} strokeWidth={1.5} />
      </button>
      {isTutor && (
        <button className="btn-action" onClick={() => setIsCreateModalOpen(true)} title="Створити групу">
          <Plus size={18} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );

  return (
    <>
      <SecondSidebar title="Мої Групи" actions={actionButtons}>
        <div className="group-sidebar__list">
          {loading ? (
            <div className="group-sidebar__status">Завантаження...</div>
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
        <CreateGroupModal onClose={() => setIsCreateModalOpen(false)} onSuccess={() => { setIsCreateModalOpen(false); fetchGroups(); }} />
      )}
      {isJoinModalOpen && (
        <JoinGroupModal onClose={() => setIsJoinModalOpen(false)} onSuccess={() => { setIsJoinModalOpen(false); fetchGroups(); }} />
      )}
      {activeGroupIdForCourse !== null && (
        <AttachCourseModal groupId={activeGroupIdForCourse} onClose={() => setActiveGroupIdForCourse(null)} onSuccess={() => { setActiveGroupIdForCourse(null); fetchGroups(); }} />
      )}
    </>
  );
};