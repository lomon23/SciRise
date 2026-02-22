interface CurrentWeatherProps {
  city: string;
  data: {
    temp: number;
    humidity: number;
    precipitation_chance: number;
    condition: string;
    advice: string;
  };
}

export const CurrentWeather = ({ city, data }: CurrentWeatherProps) => {
  return (
    <div style={{
      border: '1px solid var(--bg-accent)', 
      borderRadius: 'var(--border-radius)',
      padding: '24px',
      maxWidth: '400px',
      margin: '20px auto', 
      backgroundColor: 'var(--bg-main)'
    }}>
      <h2 style={{ marginTop: 0 }}>{city}</h2>
      
      {/* Величезна температура по центру */}
      <div style={{ fontSize: '64px', fontWeight: 'bold', margin: '10px 0' }}>
        {data.temp}°C
      </div>
      
      {/* Стан погоди (напр., Сонячно) */}
      <div style={{ fontSize: '20px', color: 'var(--bg-accent)', marginBottom: '20px' }}>
        {data.condition}
      </div>
      
      {/* Блок з додатковою інформацією (вологість та опади) */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        <div>
          <span style={{ opacity: 0.7, fontSize: '14px' }}>Вологість</span>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{data.humidity}%</div>
        </div>
        <div>
          <span style={{ opacity: 0.7, fontSize: '14px' }}>Ймовірність опадів</span>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{data.precipitation_chance}%</div>
        </div>
      </div>
      
      {/* Блок з порадою (advice) */}
      <div style={{ 
        backgroundColor: 'rgba(48, 108, 140, 0.1)', 
        padding: '12px', 
        borderRadius: '8px',
        fontSize: '15px'
      }}>
        💡 <strong>Порада:</strong> {data.advice}
      </div>
    </div>
  );
};