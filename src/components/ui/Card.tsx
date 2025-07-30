import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  onClick,
}) => {
  const baseStyles = 'rounded-2xl overflow-hidden transition-all duration-300';
  
  const variantStyles = {
    default: 'bg-white dark:bg-neutral-800',
    bordered: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700',
    elevated: 'bg-white dark:bg-neutral-800 shadow-md hover:shadow-lg dark:shadow-neutral-900',
  };
  
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };
  
  const clickableStyles = onClick ? 'cursor-pointer hover:translate-y-[-2px]' : '';
  
  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${clickableStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Card subcomponents for consistent structure
export const CardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

export const CardTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <h3 className={`text-xl font-semibold text-neutral-900 dark:text-neutral-100 ${className}`}>{children}</h3>;
};

export const CardDescription: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <p className={`text-sm text-neutral-500 dark:text-neutral-400 mt-1 ${className}`}>{children}</p>;
};

export const CardContent: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <div className={className}>{children}</div>;
};

export const CardFooter: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <div className={`mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 ${className}`}>{children}</div>;
};