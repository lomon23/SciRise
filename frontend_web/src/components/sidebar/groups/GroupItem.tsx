import { useNavigate } from 'react-router-dom';
import { Volume2, MessageSquare, Presentation, Book, Plus } from 'lucide-react';
import { useVoice } from '../../../pages/voice/VoiceContext'; 
import './GroupItem.scss';

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
                    joinVoice(channel.id.toString());
                    navigate(`/workspace/groups/${group.id}/voice/${channel.id}`);
                  } else {
                    navigate(`/workspace/groups/${group.id}/channels/${channel.id}`);
                  }
                }}
              >
                <span className="icon-wrapper">
                  {isVoice ? <Volume2 size={16} strokeWidth={1.5} /> : <MessageSquare size={16} strokeWidth={1.5} />}
                </span>
                {channel.name}
              </button>
            );
          })
        ) : (
          <div className="group-item__empty">Каналів немає</div>
        )}

        <button
          className="group-item__channel-btn"
          onClick={() => navigate(`/workspace/groups/${group.id}/board`)}
        >
          <span className="icon-wrapper"><Presentation size={16} strokeWidth={1.5} /></span>
          Інтерактивна дошка
        </button>
      </div>

      {group.courses && group.courses.length > 0 && (
        <div className="group-item__courses">
          <div className="group-item__courses-title">Курси</div>
          {group.courses.map((course) => (
            <button
              key={course.id}
              className="group-item__course-btn"
              onClick={() => navigate(`/workspace/groups/${group.id}/courses/${course.id}`)}
            >
              <span className="icon-wrapper"><Book size={16} strokeWidth={1.5} /></span>
              {course.title}
            </button>
          ))}
        </div>
      )}

      {isTutor && (
        <button
          className="group-item__add-course-btn"
          onClick={() => onAddCourseClick(group.id)}
        >
          <Plus size={14} strokeWidth={2} /> Додати курс
        </button>
      )}
    </div>
  );
};