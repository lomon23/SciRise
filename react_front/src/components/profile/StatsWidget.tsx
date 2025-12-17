import React from 'react';

interface StatsWidgetProps {
  totalNotes: number;
}

const StatsWidget: React.FC<StatsWidgetProps> = ({ totalNotes }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
      
      {/* Картка 1 */}
      <div style={cardStyle}>
        <div style={iconStyle}>📚</div>
        <div>
          <div style={numberStyle}>{totalNotes}</div>
          <div style={labelStyle}>Total Notes</div>
        </div>
      </div>

      {/* Картка 2 (Поки що заглушка, або логіка Favorites) */}
      <div style={cardStyle}>
        <div style={{...iconStyle, backgroundColor: '#FFF0F0', color: '#FF6B6B'}}>❤️</div>
        <div>
          <div style={numberStyle}>2</div>
          <div style={labelStyle}>Favorites</div>
        </div>
      </div>

    </div>
  );
};

// Styles
const cardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '15px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
  border: '1px solid #f5f5f5'
};

const iconStyle: React.CSSProperties = {
  width: '40px', height: '40px', borderRadius: '10px',
  backgroundColor: '#F3F0FF', color: '#6A5ACD',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '20px'
};

const numberStyle: React.CSSProperties = {
  fontSize: '18px', fontWeight: '800', color: '#333', lineHeight: 1
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px', color: '#999', marginTop: '2px'
};

export default StatsWidget;