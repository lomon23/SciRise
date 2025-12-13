import React from 'react';

const ProfilePage: React.FC = () => {
  // Стиль для білої картки з тінню (спільний для багатьох блоків)
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)' // Легка тінь
  };

  return (
    <div className="profile-page">
      
      {/* --- ВЕРХНЯ ЧАСТИНА --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <input 
          type="text" 
          placeholder="Search course..." 
          style={{ 
            width: '300px', 
            padding: '10px 15px', 
            borderRadius: '20px', 
            border: '1px solid #6A5ACD', // Фіолетова рамка
            outline: 'none'
          }} 
        />
        
        <div style={{ textAlign: 'right' }}>
          <h3 style={{ margin: 0 }}>November 21, 2025</h3>
          <span style={{ color: '#888' }}>Friday</span>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ color: '#666', margin: 0 }}>Hello</h4>
        <h1 style={{ margin: '5px 0' }}>Welcome, User!</h1>
      </div>

      {/* --- ОСНОВНИЙ ГРІД --- */}
      <div style={{ display: 'flex', gap: '30px' }}>

        {/* === ЛІВА КОЛОНКА === */}
        <div style={{ flex: 6 }}> 
          
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h3>Last Opened Courses</h3>
              <div style={{ color: '#6A5ACD', cursor: 'pointer' }}>{'< >'}</div>
            </div>
            
            <div style={{ display: 'flex', gap: '20px' }}>
              {/* Картка курсу 1 */}
              <div style={{ ...cardStyle, padding: 0, height: '220px', flex: 1, overflow: 'hidden' }}>
                <div style={{ height: '60%', backgroundColor: '#ccc' }}></div> {/* Сірий плейсхолдер картинки */}
                <div style={{ padding: '15px' }}>
                   <div style={{ fontSize: '12px', color: '#999' }}>Author Name</div>
                   <div style={{ fontWeight: 'bold' }}>Course One</div>
                   {/* Прогрес бар */}
                   <div style={{ height: '4px', background: '#eee', marginTop: '10px', borderRadius: '2px' }}>
                      <div style={{ width: '40%', height: '100%', background: '#6A5ACD', borderRadius: '2px' }}></div>
                   </div>
                </div>
              </div>

              {/* Картка курсу 2 */}
              <div style={{ ...cardStyle, padding: 0, height: '220px', flex: 1, overflow: 'hidden' }}>
                <div style={{ height: '60%', backgroundColor: '#ccc' }}></div>
                <div style={{ padding: '15px' }}>
                   <div style={{ fontSize: '12px', color: '#999' }}>Author Name</div>
                   <div style={{ fontWeight: 'bold' }}>Course Two</div>
                   <div style={{ height: '4px', background: '#eee', marginTop: '10px', borderRadius: '2px' }}>
                      <div style={{ width: '70%', height: '100%', background: '#6A5ACD', borderRadius: '2px' }}></div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
               <h3>Your Courses</h3>
               <span style={{ color: '#6A5ACD', fontSize: '14px', cursor: 'pointer' }}>View All</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* Список курсів - білі плашки */}
              <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}>
                <div style={{ width: '50px', height: '50px', backgroundColor: '#ddd', borderRadius: '8px' }}></div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Course One</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Author</div>
                </div>
              </div>

              <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}>
                <div style={{ width: '50px', height: '50px', backgroundColor: '#ddd', borderRadius: '8px' }}></div>
                <div>
                   <div style={{ fontWeight: 'bold' }}>Course Two</div>
                   <div style={{ fontSize: '12px', color: '#888' }}>Author</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === ПРАВА КОЛОНКА === */}
        <div style={{ flex: 5 }}>
          
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
            
            {/* Overall Progress */}
            <div style={{ ...cardStyle, flex: 1, textAlign: 'center' }}>
              <h3 style={{ fontSize: '16px', margin: '0 0 15px 0' }}>Overall Progress</h3>
              {/* Коло прогресу */}
              <div style={{ 
                width: '120px', height: '120px', 
                borderRadius: '50%', 
                border: '10px solid #6A5ACD', 
                margin: '0 auto',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', fontWeight: 'bold'
              }}>
                100%
              </div>
              <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#6A5ACD', borderRadius: '2px' }}></span> Done
              </div>
            </div>

            {/* Learning Statistic */}
            <div style={{ ...cardStyle, flex: 1 }}>
              <h3 style={{ fontSize: '16px', margin: '0 0 15px 0' }}>Learning Statistic</h3>
              <div style={{ height: '100px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '5px' }}>
                {/* Фейковий графік (стовпчики) */}
                <div style={{ width: '15%', height: '40%', background: '#9370DB', borderRadius: '5px' }}></div>
                <div style={{ width: '15%', height: '60%', background: '#6A5ACD', borderRadius: '5px' }}></div>
                <div style={{ width: '15%', height: '90%', background: '#6A5ACD', borderRadius: '5px' }}></div>
                <div style={{ width: '15%', height: '70%', background: '#6A5ACD', borderRadius: '5px' }}></div>
                <div style={{ width: '15%', height: '30%', background: '#9370DB', borderRadius: '5px' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#999', marginTop: '5px' }}>
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div style={{ ...cardStyle, height: '300px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Calendar</h3>
                <button style={{ background: '#6A5ACD', color: 'white', border: 'none', borderRadius: '15px', padding: '5px 15px', fontSize: '12px', cursor: 'pointer' }}>+ New Event</button>
             </div>
             {/* Перемикач Week/Month */}
             <div style={{ display: 'flex', background: '#6A5ACD', borderRadius: '20px', padding: '2px', marginBottom: '20px' }}>
               <div style={{ flex: 1, textAlign: 'center', color: 'white', padding: '5px', fontSize: '12px' }}>Week</div>
               <div style={{ flex: 1, textAlign: 'center', color: 'white', padding: '5px', fontSize: '12px' }}>Month</div>
               <div style={{ flex: 1, textAlign: 'center', background: 'white', color: '#6A5ACD', borderRadius: '18px', padding: '5px', fontSize: '12px', fontWeight: 'bold' }}>Year</div>
             </div>
             
             <div style={{ height: '150px', backgroundColor: '#F9F9F9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                Empty Calendar State
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;