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
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500 hover:text-neutral-700"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Eye className="h-5 w-5" aria-hidden="true" />
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
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={`
            block rounded-md shadow-sm border-neutral-300 
            focus:border-primary-500 focus:ring-primary-500 sm:text-sm
            ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon || showPasswordToggle ? 'pr-10' : ''}
            ${fullWidth ? 'w-full' : ''}
          `}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={`${props.id || props.name}-error`}
          {...props}
        />
        
        {rightIcon && !showPasswordToggle && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500">
            {rightIcon}
          </div>
        )}
        
        {showPasswordToggle && renderPasswordToggle()}
      </div>
      
      {helperText && !hasError && (
        <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
      )}
      
      {hasError && (
        <p
          className="mt-1 text-sm text-red-600"
          id={`${props.id || props.name}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';