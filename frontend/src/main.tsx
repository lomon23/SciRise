import '@fontsource/inter/400.css'; // Звичайний текст (Regular)
import '@fontsource/inter/500.css'; // Для кнопок та інпутів (Medium)
import '@fontsource/inter/600.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { BrowserRouter } from 'react-router-dom';

// Ось цей рядок включає твій SCSS:
import './assets/scss/main.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);