import { type ButtonHTMLAttributes } from 'react';
import './GlobalNavButton.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
  isActive?: boolean;
}

export const GlobalNavButton = ({ icon, label, isActive = false, ...props }: Props) => {
  return (
    <div className="global-nav-wrapper" title={label}>
      <div className={`global-nav-indicator ${isActive ? 'active' : ''}`} />
      <button className={`global-nav-btn ${isActive ? 'active' : ''}`} {...props}>
        {icon}
      </button>
    </div>
  );
};