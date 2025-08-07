import React, { forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((
  {
    label,
    helperText,
    error,
    leftIcon,
    rightIcon,
    className = '',
    fullWidth = true,
    showPasswordToggle = false,
    type = 'text',
    ...props
  },
  ref
) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const hasError = !!error;
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const renderPasswordToggle = () => {
    if (!showPasswordToggle) return null;
    
    return (
      <button
        type="button"
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors duration-200"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5 transition-transform hover:scale-110" aria-hidden="true" />
        ) : (
          <Eye className="h-5 w-5 transition-transform hover:scale-110" aria-hidden="true" />
        )}
        <span className="sr-only">
          {showPassword ? 'Hide password' : 'Show password'}
        </span>
      </button>
    );
  };
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1.5 transition-colors"
        >
          {label}
        </label>
      )}
      
      <div className="relative group">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500 dark:text-neutral-400 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-200">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={`
            block rounded-lg shadow-sm border-neutral-300 dark:border-neutral-600 
            dark:bg-neutral-800 dark:text-neutral-100
            focus:border-primary-500 focus:ring-primary-500 focus:ring-opacity-50 sm:text-sm
            transition-all duration-200 ease-in-out
            hover:border-primary-400 focus:ring-offset-2
            ${hasError ? 'border-error-500 focus:border-error-500 focus:ring-error-500 dark:border-error-400' : ''}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon || showPasswordToggle ? 'pr-10' : ''}
            ${fullWidth ? 'w-full' : ''}
          `}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={`${props.id || props.name}-error`}
          {...props}
        />
        
        {rightIcon && !showPasswordToggle && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500 dark:text-neutral-400 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-200">
            {rightIcon}
          </div>
        )}
        
        {showPasswordToggle && renderPasswordToggle()}
      </div>
      
      {helperText && !hasError && (
        <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400 transition-colors">{helperText}</p>
      )}
      
      {hasError && (
        <p
          className="mt-1.5 text-sm text-error-600 dark:text-error-400 font-medium animate-in fade-in duration-300"
          id={`${props.id || props.name}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';