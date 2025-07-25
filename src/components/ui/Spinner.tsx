import React from 'react';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  variant?: 'border' | 'dots' | 'grow';
  className?: string;
  label?: string;
  fullScreen?: boolean;
}

export function Spinner({
  size = 'md',
  color = 'primary',
  variant = 'border',
  className = '',
  label = 'Loading...',
  fullScreen = false,
}: SpinnerProps) {
  // Size classes
  const sizeClasses = {
    xs: {
      spinner: 'h-3 w-3',
      text: 'text-xs',
      dots: 'h-1 w-1 mx-0.5',
    },
    sm: {
      spinner: 'h-4 w-4',
      text: 'text-sm',
      dots: 'h-1.5 w-1.5 mx-0.5',
    },
    md: {
      spinner: 'h-6 w-6',
      text: 'text-base',
      dots: 'h-2 w-2 mx-1',
    },
    lg: {
      spinner: 'h-8 w-8',
      text: 'text-lg',
      dots: 'h-2.5 w-2.5 mx-1',
    },
    xl: {
      spinner: 'h-10 w-10',
      text: 'text-xl',
      dots: 'h-3 w-3 mx-1.5',
    },
  };

  // Color classes
  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    success: 'text-success-500',
    warning: 'text-warning-500',
    error: 'text-error-500',
    info: 'text-info-500',
    neutral: 'text-neutral-500',
  };

  // Render spinner based on variant
  const renderSpinner = () => {
    switch (variant) {
      case 'border':
        return (
          <div
            className={`
              inline-block rounded-full
              border-2 border-current border-solid
              border-r-transparent animate-spin
              ${sizeClasses[size].spinner}
              ${colorClasses[color]}
              ${className}
            `}
            role="status"
            aria-label={label}
          >
            <span className="sr-only">{label}</span>
          </div>
        );

      case 'dots':
        return (
          <div
            className={`flex items-center justify-center ${className}`}
            role="status"
            aria-label={label}
          >
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`
                    rounded-full
                    animate-pulse
                    ${sizeClasses[size].dots}
                    ${colorClasses[color]}
                  `}
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="sr-only">{label}</span>
          </div>
        );

      case 'grow':
        return (
          <div
            className={`flex items-center justify-center ${className}`}
            role="status"
            aria-label={label}
          >
            <div
              className={`
                inline-block rounded-full
                animate-pulse
                ${sizeClasses[size].spinner}
                ${colorClasses[color]}
              `}
            />
            <span className="sr-only">{label}</span>
          </div>
        );

      default:
        return null;
    }
  };

  // Full screen spinner with overlay
  if (fullScreen) {
    return (
      <div
        className="
          fixed inset-0 z-50 flex flex-col items-center justify-center
          bg-neutral-900/50 backdrop-blur-sm
        "
        role="alert"
        aria-live="assertive"
      >
        <div className="flex flex-col items-center p-4 rounded-lg bg-white shadow-lg">
          {renderSpinner()}
          {label && (
            <p className={`mt-2 ${sizeClasses[size].text} text-neutral-700`}>
              {label}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Regular spinner
  return renderSpinner();
}

// Spinner with text
export function SpinnerWithText({
  size = 'md',
  color = 'primary',
  variant = 'border',
  className = '',
  label = 'Loading...',
  position = 'right',
}: SpinnerProps & { position?: 'left' | 'right' | 'top' | 'bottom' }) {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const positionClasses = {
    left: 'flex-row space-x-2',
    right: 'flex-row-reverse space-x-reverse space-x-2',
    top: 'flex-col-reverse space-y-reverse space-y-2',
    bottom: 'flex-col space-y-2',
  };

  return (
    <div
      className={`
        flex items-center justify-center
        ${positionClasses[position]}
        ${className}
      `}
      role="status"
      aria-live="polite"
    >
      <Spinner
        size={size}
        color={color}
        variant={variant}
        label=""
      />
      {label && (
        <span className={`${sizeClasses[size]} text-neutral-700`}>
          {label}
        </span>
      )}
    </div>
  );
}

// Button with spinner
interface ButtonSpinnerProps {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  spinnerPosition?: 'left' | 'right';
  spinnerSize?: 'xs' | 'sm' | 'md';
  spinnerColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'inherit';
  spinnerVariant?: 'border' | 'dots';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function ButtonSpinner({
  loading = false,
  loadingText,
  children,
  spinnerPosition = 'left',
  spinnerSize = 'sm',
  spinnerColor = 'inherit',
  spinnerVariant = 'border',
  disabled = false,
  className = '',
  onClick,
  type = 'button',
}: ButtonSpinnerProps) {
  // Inherit color from button text
  const spinnerColorClass = spinnerColor === 'inherit' ? 'text-current' : '';

  return (
    <button
      type={type}
      className={`relative inline-flex items-center justify-center ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        <span
          className={`
            absolute inset-0 flex items-center justify-center
            bg-inherit rounded-inherit
          `}
        >
          <span
            className={`
              flex items-center
              ${loadingText ? 'space-x-2' : ''}
            `}
          >
            {spinnerPosition === 'left' && (
              <Spinner
                size={spinnerSize}
                color={spinnerColor === 'inherit' ? 'neutral' : spinnerColor}
                variant={spinnerVariant}
                className={spinnerColorClass}
                label=""
              />
            )}
            {loadingText && <span>{loadingText}</span>}
            {spinnerPosition === 'right' && (
              <Spinner
                size={spinnerSize}
                color={spinnerColor === 'inherit' ? 'neutral' : spinnerColor}
                variant={spinnerVariant}
                className={spinnerColorClass}
                label=""
              />
            )}
          </span>
        </span>
      )}
      <span className={loading ? 'invisible' : ''}>{children}</span>
    </button>
  );
}