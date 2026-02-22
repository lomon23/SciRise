interface HourlyData {
  time: string;
  temp: number;
}

interface HourlyForecastProps {
  data: HourlyData[];
}

export const HourlyForecast = ({ data }: HourlyForecastProps) => {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ margin: '30px 0' }}>
      <h3 style={{ textAlign: 'left', marginBottom: '15px' }}>⏱ Прогноз на 24 години</h3>
      
      {/* Контейнер для горизонтального скролу */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        overflowX: 'auto', 
        paddingBottom: '15px' 
      }}>
        
        {/* Проходимося по масиву даних і для кожної години малюємо плитку */}
        {data.map((hour, index) => (
          <div key={index} style={{
            minWidth: '80px', 
            padding: '16px',
            borderRadius: 'var(--border-radius)',
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--bg-accent)',
            textAlign: 'center',
            flexShrink: 0 
          }}>
            <div style={{ fontSize: '14px', marginBottom: '8px', opacity: 0.8 }}>
              {hour.time}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {hour.temp}°C
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
};