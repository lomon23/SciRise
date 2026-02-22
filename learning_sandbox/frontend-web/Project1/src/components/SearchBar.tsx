import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); 
    
    if (inputValue.trim()) {     
      onSearch(inputValue);      
      setInputValue('');         
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
      <input
        type="text"
        placeholder="Введіть назву міста..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)} 
        style={{ 
          width: '700px',
          padding: '12px', 
          borderRadius: 'var(--border-radius)', 
          border: 'none',
          outline: 'none',
          fontSize: '16px'
        }}
      />
      <button type="submit" style={{ 
        padding: '12px 24px', 
        borderRadius: 'var(--border-radius)', 
        backgroundColor: 'var(--bg-accent)', 
        color: 'var(--text-primary)',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold'
      }}>
        Знайти
      </button>
    </form>
  );
};