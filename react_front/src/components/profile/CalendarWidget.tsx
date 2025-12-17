import React, { useState } from 'react';
import Calendar from 'react-calendar';
import '../../style/calendar_custom.css'; // Імпорт наших стилів

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarWidget: React.FC = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '20px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      width: '100%'
    }}>
      <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>Calendar</h3>
        <button style={{ border: 'none', background: 'none', color: '#6A5ACD', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
            + Event
        </button>
      </div>
      
      <Calendar 
        onChange={onChange} 
        value={value} 
        locale="en-US" // Мова
        next2Label={null} // Прибираємо подвійні стрілочки
        prev2Label={null}
      />
    </div>
  );
};

export default CalendarWidget;