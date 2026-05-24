import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { axiosInstance } from '../../../api/axios';
import './CoursePlayer.scss';

export const CoursePlayer = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<any>(null);

  // Дістаємо поточного юзера для перевірки прав
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/courses/${courseId}/`);
        const data = response.data;
        setCourse(data);

        // Якщо є модулі і лекції, автоматично відкриваємо першу
        if (data.modules?.length > 0 && data.modules[0].lessons?.length > 0) {
          setActiveLesson(data.modules[0].lessons[0]);
        }
      } catch (error) {
        console.error('Помилка завантаження курсу:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) return <div className="course-player__status">Завантаження курсу...</div>;
  if (!course) return <div className="course-player__status">Курс не знайдено</div>;

  // Логіка доступу: чи викладач І чи його email збігається з email власника курсу
  const isOwner = currentUser?.role === 'tutor' && currentUser?.email === course.owner_email;

  return (
    <div className="course-player">
      <div className="course-player__header">
        <div className="course-player__info">
          <h2>{course.title}</h2>
          <span className="course-player__author">Автор: {course.owner_name || course.owner_email}</span>
        </div>
        
        {/* Кнопки бачить ТІЛЬКИ власник */}
        {isOwner && (
          <div className="course-player__actions">
            <button className="btn-action">✎ Редагувати курс</button>
            <button className="btn-action">+ Додати лекцію</button>
            <button className="btn-action">+ Опитування</button>
          </div>
        )}
      </div>

      <div className="course-player__body">
        {/* Ліва панель: Зміст (Table of Contents) */}
        <div className="course-player__toc">
          <h4 className="toc-title">Зміст курсу</h4>
          {course.modules?.length === 0 ? (
            <div className="toc-empty">Модулів ще немає</div>
          ) : (
            course.modules?.map((mod: any) => (
              <div key={mod.id} className="toc-module">
                <div className="toc-module__name">{mod.title}</div>
                <div className="toc-module__lessons">
                  {mod.lessons?.map((lesson: any) => (
                    <button
                      key={lesson.id}
                      className={`toc-lesson ${activeLesson?.id === lesson.id ? 'toc-lesson--active' : ''}`}
                      onClick={() => setActiveLesson(lesson)}
                    >
                      {lesson.lesson_type === 'text' ? '📄' : '❓'} {lesson.title}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Права панель: Рендер Markdown */}
        <div className="course-player__content">
          {activeLesson ? (
            <div className="markdown-container">
              <h1>{activeLesson.title}</h1>
              <ReactMarkdown>{activeLesson.content}</ReactMarkdown>
            </div>
          ) : (
            <div className="course-player__status">Оберіть лекцію зі змісту ліворуч</div>
          )}
        </div>
      </div>
    </div>
  );
};