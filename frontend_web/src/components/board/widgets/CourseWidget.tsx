import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { axiosInstance } from '../../../api/axios';
import './Widgets.scss';

export const CourseWidget = ({ widget, onUpdate, onHide, onDelete }: any) => {
  const savedCourseId = widget.content?.course_id;
  const activeLessonId = widget.content?.active_lesson_id;

  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const [courseData, setCourseData] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!savedCourseId) {
      const fetchAvailable = async () => {
        try {
          const res = await axiosInstance.get('/courses/');
          setAvailableCourses(res.data);
          if (res.data.length > 0) setSelectedCourseId(res.data[0].id.toString());
        } catch (error) { console.error(error); }
      };
      fetchAvailable();
    }
  }, [savedCourseId]);

  useEffect(() => {
    if (savedCourseId) {
      const fetchCourseData = async () => {
        setLoading(true);
        try {
          const res = await axiosInstance.get(`/courses/${savedCourseId}/`);
          setCourseData(res.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
      };
      fetchCourseData();
    }
  }, [savedCourseId]);

  useEffect(() => {
    if (courseData) {
      if (activeLessonId) {
        let found = null;
        for (const mod of courseData.modules || []) {
          found = mod.lessons?.find((l: any) => l.id === activeLessonId);
          if (found) break;
        }
        if (found) setActiveLesson(found);
      } else if (courseData.modules?.length > 0 && courseData.modules[0].lessons?.length > 0) {
        setActiveLesson(courseData.modules[0].lessons[0]);
      }
    }
  }, [activeLessonId, courseData]);

  const handleSave = () => {
    if (selectedCourseId) {
      onUpdate(widget.id, { ...widget.content, course_id: selectedCourseId });
    }
  };

  const handleSelectLesson = (lesson: any) => {
    setActiveLesson(lesson);
    setIsMenuOpen(false);
    onUpdate(widget.id, { ...widget.content, active_lesson_id: lesson.id });
  };

  return (
    <div className="widget-inner course-widget">
      <div className="widget-header">
        <div className="header-left course-header-left">
          {savedCourseId && courseData && (
            <button 
              className="course-burger-btn" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </button>
          )}
          <span>📚 {courseData ? courseData.title : 'Курс'}</span>
        </div>
        <div className="header-actions">
          <button className="widget-btn hide-btn" onClick={onHide} title="Згорнути">—</button>
          <button className="widget-btn close-btn" onClick={onDelete} title="Закрити повністю">✕</button>
        </div>
      </div>

      <div className="widget-body" onPointerDown={(e) => e.stopPropagation()}>
        {!savedCourseId ? (
          <div className="course-widget-setup">
            <select 
              value={selectedCourseId} 
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              {availableCourses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
            <button onClick={handleSave}>Прив'язати</button>
          </div>
        ) : loading ? (
          <div className="course-loading">Завантаження...</div>
        ) : (
          <div className="course-widget-viewer">
            <div className={`course-widget-sidebar ${isMenuOpen ? 'open' : ''}`}>
              <div className="sidebar-title">Зміст</div>
              {courseData?.modules?.map((mod: any) => (
                <div key={mod.id} className="sidebar-module">
                  <div className="sidebar-module-title">{mod.title}</div>
                  {mod.lessons?.map((lesson: any) => (
                    <button 
                      key={lesson.id}
                      className={`sidebar-lesson ${activeLesson?.id === lesson.id ? 'active' : ''}`}
                      onClick={() => handleSelectLesson(lesson)}
                    >
                      📄 {lesson.title}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {isMenuOpen && (
              <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>
            )}

            <div className="course-widget-content markdown-container">
              {activeLesson ? (
                <>
                  <h2>{activeLesson.title}</h2>
                  <ReactMarkdown>{activeLesson.content}</ReactMarkdown>
                </>
              ) : (
                <p>Оберіть лекцію в меню.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};