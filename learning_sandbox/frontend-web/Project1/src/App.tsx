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

  const fetchWeather = async (city: string) => {
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