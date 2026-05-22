import { useParams } from 'react-router-dom';

export const CourseDetail = () => {
  // Витягуємо параметри з URL. 
  // groupId буде присутній тільки якщо ми зайшли через сайдбар групи
  const { courseId, groupId } = useParams();

  return (
    <div style={{ padding: '40px', color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
          Робоча зона курсу #{courseId}
        </h1>
        {groupId && (
          <p style={{ color: '#3b82f6', margin: '4px 0 0', fontSize: '14px' }}>
            Відкрито в контексті групи #{groupId}
          </p>
        )}
      </div>

      <div style={{ 
        border: '2px dashed #334155', 
        borderRadius: '12px', 
        padding: '100px 40px', 
        textAlign: 'center', 
        color: '#64748b',
        fontSize: '15px'
      }}>
        Тут буде плеєр курсу: список модулів зліва (або зверху), відео/текст уроку по центру. 
        <br/><br/>
        Поки що це просто заглушка, щоб роутер не кидав 404.
      </div>
    </div>
  );
};