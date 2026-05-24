import { useNavigate } from 'react-router-dom';
import './GroupItem.scss';

// Додаємо інтерфейс для курсу
interface AttachedCourse {
  id: number;
  title: string;
}

// Додаємо інтерфейс каналу
interface AttachedChannel {
  id: number;
  name: string;
  channel_type: string; // 'text' або 'voice', залежить від твоєї моделі
}

interface GroupData {
  id: number;
  name: string;
  courses?: AttachedCourse[]; 
  channels?: AttachedChannel[]; // Додаємо масив каналів
}

interface Props {
  group: GroupData;
  onAddCourseClick: (groupId: number) => void;
}

export const GroupItem = ({ group, onAddCourseClick }: Props) => {
  const navigate = useNavigate();

  // Перевірка ролі, щоб приховати кнопку "+ Додати курс" для студентів
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isTutor = user?.role === 'tutor';

  return (
    <div className="group-item">
      <div className="group-item__header">
        <span className="group-item__name">{group.name}</span>
      </div>
      
      <div className="group-item__channels">
        {group.channels && group.channels.length > 0 ? (
          group.channels.map((channel) => (
            <button
              key={channel.id}
              className="group-item__channel-btn"
              onClick={() => navigate(`/workspace/groups/${group.id}/channels/${channel.id}`)}
            >
              {channel.channel_type === 'voice' ? '🔊' : '💬'} {channel.name}
            </button>
          ))
        ) : (
          <div style={{ fontSize: '12px', color: '#555', padding: '4px 8px' }}>
            Каналів немає
          </div>
        )}
      </div>

      {/* Рендеримо прикріплені курси, якщо вони є */}
      {group.courses && group.courses.length > 0 && (
        <div className="group-item__courses">
          <div className="group-item__courses-title">Курси:</div>
          {group.courses.map((course) => (
            <button
              key={course.id}
              className="group-item__course-btn"
              onClick={() => navigate(`/workspace/courses/${course.id}`)}
            >
              📚 {course.title}
            </button>
          ))}
        </div>
      )}

      {/* Кнопка додавання курсу доступна тільки викладачу */}
      {isTutor && (
        <button
          className="group-item__add-course-btn"
          onClick={() => onAddCourseClick(group.id)}
        >
          + Додати курс
        </button>
      )}
    </div>
  );
};