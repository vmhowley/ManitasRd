import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'danger' | 'info' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon,
  onClick,
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full transition-all duration-200';
  
  const variantStyles = {
    default: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300',
    secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-300',
    success: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    danger: 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-300',
    info: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300',
    outline: 'border border-neutral-300 bg-transparent text-neutral-700 dark:border-neutral-600 dark:text-neutral-300',
  };
  
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };
  
  const clickableStyles = onClick ? 'cursor-pointer hover:opacity-90 hover:shadow-sm active:scale-95' : '';
  
  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${clickableStyles} ${className}`}
      onClick={onClick}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};