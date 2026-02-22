import { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { getWeather } from './services/api';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState<any>(null); 
  const [loading, setLoading] = useState(false);             
  const [error, setError] = useState<string | null>(null);   

  const fetchWeather = async (city: string) => {
    setLoading(true);    
    setError(null);      
    setWeatherData(null); 

    try {
      const response = await getWeather(city);
      
      setWeatherData({
        city: response.data.city,
        current: response.data.current
      });
    } catch (err) {
      setError('Місто не знайдено');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchWeather('Львів'); 
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🌤️ Прогноз погоди</h1>
      
      {/* Передаємо функцію fetchWeather у наш рядок пошуку */}
      <SearchBar onSearch={fetchWeather} />

      {/* 4. Умовне відображення (Conditional Rendering) */}
      
      {/* Якщо loading === true, показуємо текст завантаження */}
      {loading && <p style={{ fontSize: '18px' }}>Завантаження даних...</p>}
      
      {/* Якщо є помилка, виводимо її червоним кольором */}
      {error && <p style={{ color: '#ff4d4d', fontSize: '18px', fontWeight: 'bold' }}>{error}</p>}
      
      {/* Якщо дані є, і ми не вантажимось, і немає помилок — малюємо картку! */}
      {weatherData && !loading && !error && (
        <CurrentWeather 
          city={weatherData.city} 
          data={weatherData.current} 
        />
      )}
    </div>
  );
}

export default App;