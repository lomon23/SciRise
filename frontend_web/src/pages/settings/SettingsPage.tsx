import { useState } from 'react';
import './SettingsPage.scss';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<'account' | 'appearance' | 'notifications'>('account');

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1 className="settings-title">Налаштування</h1>
        
        <div className="settings-layout">
          {/* БОКОВЕ МЕНЮ НАЛАШТУВАНЬ */}
          <aside className="settings-sidebar">
            <button 
              className={activeTab === 'account' ? 'active' : ''} 
              onClick={() => setActiveTab('account')}
            >
              👤 Обліковий запис
            </button>
            <button 
              className={activeTab === 'appearance' ? 'active' : ''} 
              onClick={() => setActiveTab('appearance')}
            >
              🎨 Вигляд
            </button>
            <button 
              className={activeTab === 'notifications' ? 'active' : ''} 
              onClick={() => setActiveTab('notifications')}
            >
              🔔 Сповіщення
            </button>
          </aside>

          {/* КОНТЕНТ */}
          <main className="settings-content">
            {activeTab === 'account' && (
              <div className="settings-section animate-fade">
                <h2>Обліковий запис</h2>
                <p className="desc">Керування вашою особистою інформацією.</p>
                
                <div className="form-group">
                  <label>Ім'я користувача</label>
                  <input type="text" defaultValue="teacher" disabled />
                </div>
                
                <div className="form-group">
                  <label>Email адреса</label>
                  <input type="email" defaultValue="teacher@gmail.com" disabled />
                </div>

                <div className="divider"></div>

                <h2 className="danger-text">Danger Zone</h2>
                <div className="danger-box">
                  <div>
                    <strong>Видалити обліковий запис</strong>
                    <p>Це назавжди видалить ваші дані, курси та повідомлення.</p>
                  </div>
                  <button className="btn-danger" onClick={() => alert('На презі це не натискати!')}>
                    Видалити
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="settings-section animate-fade">
                <h2>Вигляд</h2>
                <p className="desc">Налаштування інтерфейсу платформи.</p>
                
                <div className="theme-selector">
                  <div className="theme-option active">
                    <div className="theme-preview dark"></div>
                    <span>Dark (Default)</span>
                  </div>
                  <div className="theme-option">
                    <div className="theme-preview light"></div>
                    <span>Light</span>
                  </div>
                  <div className="theme-option">
                    <div className="theme-preview arch"></div>
                    <span>Arch Theme</span>
                  </div>
                </div>

                <div className="toggle-group">
                  <div className="toggle-info">
                    <strong>Компактний режим</strong>
                    <p>Зменшити відступи між повідомленнями у чаті.</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="settings-section animate-fade">
                <h2>Сповіщення</h2>
                <p className="desc">Оберіть, про що ви хочете отримувати сповіщення.</p>
                
                <div className="toggle-group">
                  <div className="toggle-info">
                    <strong>Нові повідомлення</strong>
                    <p>Сповіщати про повідомлення у групах.</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <div className="toggle-info">
                    <strong>Звук при підключенні до войсу</strong>
                    <p>Відтворювати короткий сигнал.</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};