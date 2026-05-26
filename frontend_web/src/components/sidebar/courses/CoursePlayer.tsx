import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { axiosInstance } from '../../../api/axios';
import './CoursePlayer.scss';

export const CoursePlayer = () => {
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonIdParam = searchParams.get('lesson');

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/courses/${courseId}/`);
        setCourse(response.data);
      } catch (error) {
        console.error('Помилка завантаження курсу:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const activeLesson = useMemo(() => {
    if (!course || !lessonIdParam) return null;
    for (const mod of course.modules || []) {
      const found = mod.lessons?.find((l: any) => l.id.toString() === lessonIdParam);
      if (found) return found;
    }
    return null;
  }, [course, lessonIdParam]);

  if (loading) return <div className="course-player__status">...</div>;
  if (!course) return <div className="course-player__status">Курс не знайдено</div>;

  const isOwner = currentUser?.role === 'tutor' && currentUser?.email === course.owner_email;

  return (
    <div className="course-player">
      <div className="course-player__header">
        <div className="course-player__info">
          <h2>{course.title}</h2>
          <span className="course-player__author">Автор: {course.owner_name || course.owner_email}</span>
        </div>
        
        {isOwner && (
          <div className="course-player__actions">
            <button className="btn-action">✎ Редагувати</button>
            <button className="btn-action">+ Опитування</button>
          </div>
        )}
      </div>

      <div className="course-player__body">
        <div className="course-player__content">
          {activeLesson ? (
            <div className="markdown-container">
              {/* Кнопка повернення до плиток */}
              <button className="btn-back-to-tiles" onClick={() => setSearchParams({})}>
                ← До списку лекцій
              </button>
              <h1>{activeLesson.title}</h1>
              <ReactMarkdown>{activeLesson.content}</ReactMarkdown>
            </div>
          ) : (
            <div className="course-overview">
              <div className="course-overview__intro">
                <h3>Про курс</h3>
                <p>{course.description || "Опис відсутній."}</p>
              </div>

              <h4 className="grid-title">Лекційні блоки</h4>
              
              {/* СІТКА З ПЛИТКАМИ */}
              <div className="lessons-grid">
                {course.modules?.flatMap((mod: any) => 
                  (mod.lessons || []).map((lesson: any) => (
                    <div 
                      key={lesson.id} 
                      className="lesson-tile"
                      onClick={() => setSearchParams({ lesson: lesson.id.toString() })}
                    >
                      <div className="lesson-tile__icon">📄</div>
                      <div className="lesson-tile__meta">
                        <span className="lesson-tile__mod-title">{mod.title}</span>
                        <span className="lesson-tile__les-title">{lesson.title}</span>
                      </div>
                    </div>
                  ))
                )}
                {(!course.modules || course.modules.flatMap((m: any) => m.lessons || []).length === 0) && (
                  <div className="grid-empty">В цьому курсі ще немає лекцій.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};