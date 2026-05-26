import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axios'; // ЗМІНИ НА СВІЙ ШЛЯХ ДО AXIOS
import './ProfilePage.scss';

interface Group {
  id: number;
  name: string;
  created_at?: string;
}

interface Course {
  id: number;
  title: string;
  description?: string;
}

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'groups' | 'courses'>('groups');
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Тягнемо локальні дані юзера для лівого сайдбару
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { 
    first_name: 'Unknown', 
    last_name: 'User', 
    email: 'no-email@test.com',
    role: 'student'
  };

  // Підключаємо реальні ендпоінти
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        // Робимо два запити паралельно для швидкості
        const [groupsRes, coursesRes] = await Promise.all([
          axiosInstance.get('/groups/'),
          axiosInstance.get('/courses/')
        ]);
        
        setGroups(groupsRes.data);
        setCourses(coursesRes.data);
      } catch (error) {
        console.error('Помилка завантаження даних профілю:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* ЛІВИЙ ДІВ: ІНФОРМАЦІЯ */}
        <aside className="profile-sidebar">
          <div className="profile-avatar">
            <img src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=1a1a1a&color=deff9a&size=256`} alt="Avatar" />
          </div>
          
          <h1 className="profile-name">
            <span className="fullname">{user.first_name} {user.last_name}</span>
            <span className="username">{user.email.split('@')[0]}</span>
          </h1>

          <button className="edit-profile-btn" onClick={() => alert('Поки заглушка')}>
            Редагувати профіль
          </button>

          <div className="profile-details">
            <div className="detail-item">
              <span className="icon">Роль:</span> 
              <span className="value">{user.role === 'tutor' ? 'Викладач' : 'Студент'}</span>
            </div>
            <div className="detail-item">
              <span className="icon">Email:</span> 
              <span className="value">{user.email}</span>
            </div>
          </div>
        </aside>

        {/* ЦЕНТРАЛЬНИЙ ДІВ: КОНТЕНТ */}
        <main className="profile-content">
          
          {/* ТАБИ */}
          <nav className="profile-tabs">
            <button 
              className={activeTab === 'groups' ? 'active' : ''} 
              onClick={() => setActiveTab('groups')}
            >
              👥 Мої Групи <span className="badge">{groups.length}</span>
            </button>
            <button 
              className={activeTab === 'courses' ? 'active' : ''} 
              onClick={() => setActiveTab('courses')}
            >
              📚 Мої Курси <span className="badge">{courses.length}</span>
            </button>
          </nav>

          {/* СПИСКИ З РЕАЛЬНИМИ ДАНИМИ */}
          <div className="tab-content">
            {isLoading ? (
              <div className="loading-state">Завантаження даних...</div>
            ) : (
              <>
                {/* РЕНДЕР ГРУП */}
                {activeTab === 'groups' && (
                  <div className="items-grid">
                    {groups.length > 0 ? (
                      groups.map(group => (
                        <div key={group.id} className="data-card" onClick={() => navigate(`/workspace/groups/${group.id}`)}>
                          <h3>{group.name}</h3>
                          <span className="card-type">Workspace</span>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">У вас ще немає груп.</div>
                    )}
                  </div>
                )}

                {/* РЕНДЕР КУРСІВ */}
                {activeTab === 'courses' && (
                  <div className="items-grid">
                    {courses.length > 0 ? (
                      courses.map(course => (
                        <div key={course.id} className="data-card" onClick={() => navigate(`/workspace/courses/${course.id}`)}>
                          <h3>{course.title}</h3>
                          <p>{course.description || 'Опис відсутній...'}</p>
                          <span className="card-type">Course</span>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">У вас ще немає курсів.</div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};