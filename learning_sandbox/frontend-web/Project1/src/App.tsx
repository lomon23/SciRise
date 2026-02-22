import { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { getWeather } from './services/api';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState<any>(null); 
  const [loading, setLoading] = useState(false);             
  const [error, setError] = useState<string | null>(null);   

  /*const fetchWeather = async (city: string) => {
    setLoading(true);    
    setError(null);      
    setWeatherData(null); 

    try {
      const response = await getWeather(city);
      setWeatherData(response.data);
    } catch (err) {
      setError('Місто не знайдено');
    } finally {
      setLoading(false);
    }
  };*/

  const fetchWeather = async (city: string) => {
  setLoading(true);
  setError(null);
  
  // Імітуємо затримку мережі
  setTimeout(() => {
    setWeatherData({
      city: city,
      current: { temp: 22, humidity: 45, precipitation_chance: 10, condition: 'Сонячно', advice: 'Гарна погода для прогулянки!' },
      hourly: Array(24).fill(null).map((_, i) => ({ time: `${i}:00`, temp: 20 + Math.random() * 5 })),
      daily: Array(7).fill(null).map((_, i) => ({ date: `2026-02-${23+i}`, temp_max: 25, temp_min: 18, condition: 'Ясно' }))
    });
    setLoading(false);
  }, 500);
};

  useEffect(() => {
    fetchWeather('Львів'); 
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1>🌤️ Прогноз погоди</h1>
      
      <SearchBar onSearch={fetchWeather} />

      {loading && <p style={{ fontSize: '18px' }}>Завантаження даних...</p>}
      
      {error && <p style={{ color: '#ff4d4d', fontSize: '18px', fontWeight: 'bold' }}>{error}</p>}
      
      {weatherData && !loading && !error && (
        <>
          {/* 1. Поточна погода */}
          <CurrentWeather 
            city={weatherData.city} 
            data={weatherData.current} 
          />

          {/* 2. Погодинний прогноз (24 об'єкти) */}
          <HourlyForecast data={weatherData.hourly} />

          {/* 3. Прогноз на тиждень (7 об'єктів) */}
          <DailyForecast data={weatherData.daily} />
        </>
      )}
    </div>
  );
}

export default App;