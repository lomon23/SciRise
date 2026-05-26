import { useNavigate } from 'react-router-dom';
import './GroupItem.scss';
import { useVoice } from '../../../pages/voice/VoiceContext'; 

interface AttachedCourse {
  id: number;
  title: string;
}

interface AttachedChannel {
  id: number;
  name: string;
  channel_type: string; 
}

interface GroupData {
  id: number;
  name: string;
  courses?: AttachedCourse[]; 
  channels?: AttachedChannel[]; 
}

interface Props {
  group: GroupData;
  onAddCourseClick: (groupId: number) => void;
}

export const GroupItem = ({ group, onAddCourseClick }: Props) => {
  const navigate = useNavigate();
  const { joinVoice, currentRoom } = useVoice();

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
          group.channels.map((channel) => {
            const isVoice = channel.channel_type === 'voice';
            const isActiveVoice = isVoice && currentRoom === channel.id.toString();

            return (
              <button
                key={channel.id}
                className={`group-item__channel-btn ${isActiveVoice ? 'active-voice' : ''}`}
                onClick={() => {
                  if (isVoice) {
                    // 1. ПІДКЛЮЧАЄМОСЯ ДО ВЕБРАТЦ
                    joinVoice(channel.id.toString());
                    // 2. ПЕРЕХОДИМО НА СТОРІНКУ
                    navigate(`/workspace/groups/${group.id}/voice/${channel.id}`);
                  } else {
                    navigate(`/workspace/groups/${group.id}/channels/${channel.id}`);
                  }
                }}
              >
                {isVoice ? '🔊' : '💬'} {channel.name}
              </button>
            );
          })
        ) : (
          <div style={{ fontSize: '12px', color: '#555', padding: '4px 8px' }}>
            Каналів немає
          </div>
        )}

        <button
          className="group-item__channel-btn"
          onClick={() => navigate(`/workspace/groups/${group.id}/board`)}
        >
          🖍 Інтерактивна дошка
        </button>
      </div>

      {group.courses && group.courses.length > 0 && (
        <div className="group-item__courses">
          <div className="group-item__courses-title">Курси:</div>
          {group.courses.map((course) => (
            <button
              key={course.id}
              className="group-item__course-btn"
              onClick={() => navigate(`/workspace/groups/${group.id}/courses/${course.id}`)}
            >
              📚 {course.title}
            </button>
          ))}
        </div>
      )}

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