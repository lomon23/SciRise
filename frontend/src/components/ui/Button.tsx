import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import './Button.scss';

// Розширюємо стандартні пропси HTML-кнопки, щоб працював onClick, type="submit", disabled і т.д.
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props // ловимо всі інші стандартні атрибути (onClick, disabled)
}: ButtonProps) => {
  
  // Збираємо класи до купи залежно від пропсів
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full' : '',
    className // якщо раптом треба буде докинути якийсь кастомний марджін ззовні
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};