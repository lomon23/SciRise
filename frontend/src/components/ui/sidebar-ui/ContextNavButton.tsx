import { type ButtonHTMLAttributes } from 'react';
import './ContextNavButton.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
  isActive?: boolean;
}

export const ContextNavButton = ({ icon, label, isActive = false, ...props }: Props) => {
  return (
    <button className={`context-nav-btn ${isActive ? 'active' : ''}`} {...props}>
      <span className="context-nav-icon">{icon}</span>
      <span className="context-nav-label">{label}</span>
    </button>
  );
};