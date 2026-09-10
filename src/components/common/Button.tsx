import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'accent-solid';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'padding: 5px 10px; font-size: 12px;',
    md: 'padding: 8px 14px; font-size: 13px;',
    lg: 'padding: 10px 18px; font-size: 14px;',
  };

  return (
    <button
      className={`btn btn-${variant} ${className}`}
      data-size={size}
      {...props}
    >
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
