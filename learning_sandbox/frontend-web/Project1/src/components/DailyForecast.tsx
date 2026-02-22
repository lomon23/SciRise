interface DailyData {
  date: string;
  temp_max: number;
  temp_min: number;
  condition: string;
}

interface DailyForecastProps {
  data: DailyData[];
}

export const DailyForecast = ({ data }: DailyForecastProps) => {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ margin: '30px 0' }}>
      <h3 style={{ textAlign: 'left', marginBottom: '15px' }}>📅 Прогноз на тиждень</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {data.map((day, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            borderRadius: 'var(--border-radius)',
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--bg-accent)'
          }}>
            {/* Дата */}
            <div style={{ fontWeight: 'bold', minWidth: '100px', textAlign: 'left' }}>
              {day.date}
            </div>
            
            {/* Стан погоди */}
            <div style={{ opacity: 0.8, flex: 1, textAlign: 'center' }}>
              {day.condition}
            </div>
            
            {/* Діапазон температур */}
            <div style={{ minWidth: '100px', textAlign: 'right' }}>
              <span style={{ fontWeight: 'bold' }}>{day.temp_max}°</span>
              <span style={{ marginLeft: '10px', opacity: 0.6 }}>{day.temp_min}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};