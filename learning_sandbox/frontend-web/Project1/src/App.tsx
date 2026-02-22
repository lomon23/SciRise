import { SearchBar } from './components/SearchBar';
import './App.css'; 

function App() {

  const handleSearch = (city: string) => {
    console.log("Користувач хоче знайти погоду для міста:", city);
    
    // Трохи пізніше ми додамо сюди виклик функції getWeather з нашого api.js
  };

  return (
    <div className="app-container" style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🌤️ Прогноз погоди</h1>
      
      {/* Викликаємо наш компонент і передаємо йому функцію */}
      <SearchBar onSearch={handleSearch} />
      
    </div>
  );
}

export default App;