import React from 'react';

const HomePage: React.FC = () => {
  // --- ХАРДКОД ДАНІ (Імітація бази даних) ---
  const favorites = [
    { id: 1, title: 'Course Name 1' },
    { id: 2, title: 'Course Name 2' },
    { id: 3, title: 'Course Name 3' },
    { id: 4, title: 'Course Name 4' },
    { id: 5, title: 'Course Name 5' },
    { id: 6, title: 'Course Name 6' },
  ];

  const notes = [
    { id: 1, title: 'My Note 1' },
    { id: 2, title: 'Project Ideas' },
    { id: 3, title: 'Meeting Notes' },
  ];

  // --- СТИЛІ ---
  const sectionTitleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333'
  };

  const scrollContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '20px',
    overflowX: 'auto', // Дозволяє гортати вбік, якщо не влазить
    paddingBottom: '10px',
    scrollbarWidth: 'none' as 'none', // Приховує скролбар для Firefox
    msOverflowStyle: 'none', // Для IE/Edge
  };

  // Стиль для карток у "Favorites"
  const favoriteCardStyle = {
    minWidth: '200px',
    height: '240px',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as 'column',
    flexShrink: 0 // Щоб картки не стискались
  };

  // Стиль для карток у "Your Notes"
  const noteCardStyle = {
    minWidth: '220px',
    height: '150px',
    borderRadius: '15px',
    flexShrink: 0
  };

  return (
    <div style={{ paddingBottom: '50px' }}>
      
      {/* === СЕКЦІЯ FAVORITES === */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={sectionTitleStyle}>Favorites</h2>
        
        <div style={scrollContainerStyle} className="hide-scrollbar">
          {favorites.map((item) => (
            <div key={item.id} style={favoriteCardStyle}>
              {/* Верхня сіра частина (обкладинка) */}
              <div style={{ flex: 3, backgroundColor: '#ccc' }}></div>
              {/* Нижня біла частина (назва) */}
              <div style={{ flex: 2, padding: '15px', display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ width: '100%', height: '20px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}></div> 
                {/* ^ Це просто заглушка тексту як на макеті, або можна вивести {item.title} */}
              </div>
            </div>
          ))}
          
          {/* Кнопка прокрутки (фейкова, візуальна, як на скріні) */}
          <div style={{ 
            minWidth: '50px', height: '50px', 
            borderRadius: '50%', backgroundColor: 'white', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            alignSelf: 'center', cursor: 'pointer', marginLeft: '-25px', zIndex: 1
          }}>
            <span style={{ color: '#6A5ACD', fontWeight: 'bold', fontSize: '20px' }}>{'>'}</span>
          </div>
        </div>
      </div>

      {/* Розділювач */}
      <hr style={{ border: '0', borderTop: '1px solid #e0e0e0', marginBottom: '40px' }} />

      {/* === СЕКЦІЯ YOUR NOTES === */}
      <div>
        <h2 style={sectionTitleStyle}>Your Notes</h2>

        <div style={scrollContainerStyle}>
          
          {/* 1. Картка додавання нового запису (+) */}
          <div style={{ 
            ...noteCardStyle, 
            backgroundColor: 'white', 
            border: '2px dashed #e0e0e0', // Пунктирний бордюр (опціонально) або тінь
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <div style={{ fontSize: '50px', color: '#ccc', fontWeight: '300' }}>+</div>
          </div>

          {/* 2. Інші замітки (Mapping) */}
          {notes.map((note) => (
            <div key={note.id} style={{ 
              ...noteCardStyle, 
              backgroundColor: '#ccc', // Сірий фон як на скріншоті
              position: 'relative'
            }}>
              {/* Можна додати текст, якщо треба */}
            </div>
          ))}

           {/* Кнопка прокрутки для Notes */}
           <div style={{ 
            minWidth: '50px', height: '50px', 
            borderRadius: '50%', backgroundColor: 'white', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            alignSelf: 'center', cursor: 'pointer', marginLeft: '-25px', zIndex: 1
          }}>
            <span style={{ color: '#6A5ACD', fontWeight: 'bold', fontSize: '20px' }}>{'>'}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;