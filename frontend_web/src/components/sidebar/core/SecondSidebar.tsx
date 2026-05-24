import { type ReactNode } from 'react';
import './SecondSidebar.scss';

interface Props {
  title: string;
  actions?: ReactNode; // Кнопки в шапці
  children: ReactNode; // Список (групи, курси тощо)
}

export const SecondSidebar = ({ title, actions, children }: Props) => {
  return (
    <aside className="second-sidebar">
      <div className="second-sidebar__header">
        <h3 className="second-sidebar__title">{title}</h3>
        {actions && <div className="second-sidebar__actions">{actions}</div>}
      </div>
      <div className="second-sidebar__content">
        {children}
      </div>
    </aside>
  );
};