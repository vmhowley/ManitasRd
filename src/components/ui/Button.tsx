import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger' | 'subtle';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isFullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm active:scale-95';
  
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus:ring-primary-500 hover:shadow-md',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 active:bg-secondary-800 focus:ring-secondary-500 hover:shadow-md',
    outline: 'border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:ring-primary-500 text-neutral-800 dark:text-neutral-200',
    ghost: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:ring-primary-500 text-neutral-800 dark:text-neutral-200',
    link: 'bg-transparent underline-offset-4 hover:underline text-primary-600 hover:text-primary-700 focus:ring-primary-500 shadow-none',
    danger: 'bg-red-600 text-white hover:bg-accent-700 active:bg-accent-800 focus:ring-accent-500 hover:shadow-md',
    subtle: 'bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600 focus:ring-neutral-500',
  };
  
  const sizeStyles = {
    xs: 'text-xs px-3 py-1.5 rounded-xl',
    sm: 'text-sm px-4 py-2 rounded-xl',
    md: 'text-sm px-5 py-2.5 rounded-2xl',
    lg: 'text-base px-6 py-3 rounded-2xl',
    xl: 'text-lg px-8 py-4 rounded-3xl',
  };
  
  const fullWidthStyles = isFullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidthStyles} ${className} ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};