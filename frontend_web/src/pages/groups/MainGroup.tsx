import { Users, LayoutGrid, ShieldCheck } from 'lucide-react';
import './MainGroup.scss';

export const MainGroup = () => {
  return (
    <div className="main-group">
      <div className="main-group__content">
        <div className="welcome-card">
          <div className="welcome-card__icon">
            <Users size={32} />
          </div>
          <h1>Вітаємо у групі</h1>
          <p>Оберіть канал у меню зліва для початку роботи або скористайтеся інструментами керування.</p>
          
          <div className="welcome-actions">
            <div className="action-item">
              <LayoutGrid size={20} />
              <span>Інтерактивна дошка</span>
            </div>
            <div className="action-item">
              <ShieldCheck size={20} />
              <span>Керування учасниками</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};