import { ReactNode } from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  label?: string | ReactNode;
  showValue?: boolean;
  valueFormat?: (value: number, max: number) => string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
  barClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  animated?: boolean;
  striped?: boolean;
}

export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  valueFormat,
  size = 'md',
  variant = 'default',
  className = '',
  barClassName = '',
  labelClassName = '',
  valueClassName = '',
  animated = false,
  striped = false,
}: ProgressProps) {
  // Ensure value is between 0 and max
  const normalizedValue = Math.max(0, Math.min(value, max));
  const percentage = (normalizedValue / max) * 100;

  // Format the displayed value
  const formattedValue = valueFormat
    ? valueFormat(normalizedValue, max)
    : `${Math.round(percentage)}%`;

  // Size classes
  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-primary-600',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
    info: 'bg-info-500',
  };

  // Animation classes
  const animationClass = animated ? 'animate-pulse' : '';

  // Striped pattern
  const stripedClass = striped
    ? 'bg-stripes bg-stripes-white/20'
    : '';

  return (
    <div className={`w-full ${className}`}>
      {/* Label and value */}
      {(label || showValue) && (
        <div className="flex justify-between mb-1">
          {label && (
            <div className={`text-sm font-medium text-neutral-700 ${labelClassName}`}>
              {label}
            </div>
          )}
          {showValue && (
            <div className={`text-sm font-medium text-neutral-700 ${valueClassName}`}>
              {formattedValue}
            </div>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div
        className={`w-full overflow-hidden rounded-full bg-neutral-200 ${sizeClasses[size]}`}
        role="progressbar"
        aria-valuenow={normalizedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={formattedValue}
      >
        <div
          className={`${variantClasses[variant]} ${sizeClasses[size]} ${animationClass} ${stripedClass} ${barClassName} transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Indeterminate progress bar for loading states
export function IndeterminateProgress({
  size = 'md',
  variant = 'default',
  className = '',
  label,
  labelClassName = '',
}: Omit<ProgressProps, 'value' | 'max' | 'showValue' | 'valueFormat'> & {
  label?: string | ReactNode;
}) {
  // Size classes
  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-primary-600',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
    info: 'bg-info-500',
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className={`text-sm font-medium text-neutral-700 mb-1 ${labelClassName}`}>
          {label}
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full bg-neutral-200 ${sizeClasses[size]}`}
        role="progressbar"
        aria-valuetext="Loading"
        aria-busy="true"
      >
        <div
          className={`${variantClasses[variant]} ${sizeClasses[size]} animate-progress-indeterminate`}
          style={{ width: '40%' }}
        />
      </div>
    </div>
  );
}

// Multi-step progress indicator
interface ProgressStepProps {
  steps: Array<{
    label: string;
    description?: string;
    status?: 'complete' | 'current' | 'upcoming';
  }>;
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function ProgressSteps({
  steps,
  currentStep,
  orientation = 'horizontal',
  className = '',
}: ProgressStepProps) {
  return (
    <div
      className={`${orientation === 'vertical' ? 'flex flex-col space-y-4' : 'flex items-center'} ${className}`}
      aria-label="Progress"
    >
      {steps.map((step, index) => {
        const status = index < currentStep
          ? 'complete'
          : index === currentStep
          ? 'current'
          : 'upcoming';

        const isLast = index === steps.length - 1;

        return (
          <div
            key={index}
            className={`${orientation === 'horizontal' ? 'flex-1' : 'w-full'} relative`}
          >
            {/* Step indicator */}
            <div className="flex items-center">
              {/* Step circle */}
              <div
                className={`
                  flex h-8 w-8 items-center justify-center rounded-full
                  ${status === 'complete' ? 'bg-primary-600' : ''}
                  ${status === 'current' ? 'border-2 border-primary-600 bg-white' : ''}
                  ${status === 'upcoming' ? 'border-2 border-neutral-300 bg-white' : ''}
                `}
              >
                {status === 'complete' ? (
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span
                    className={`text-sm font-medium
                      ${status === 'current' ? 'text-primary-600' : 'text-neutral-500'}
                    `}
                  >
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Connector line */}
              {!isLast && orientation === 'horizontal' && (
                <div className="flex-1 ml-4 mr-4">
                  <div
                    className={`h-0.5 w-full ${index < currentStep ? 'bg-primary-600' : 'bg-neutral-300'}`}
                  />
                </div>
              )}

              {/* Step content for vertical orientation */}
              {orientation === 'vertical' && (
                <div className="ml-4">
                  <p
                    className={`text-sm font-medium
                      ${status === 'complete' ? 'text-primary-600' : ''}
                      ${status === 'current' ? 'text-primary-600' : ''}
                      ${status === 'upcoming' ? 'text-neutral-500' : ''}
                    `}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-sm text-neutral-500">{step.description}</p>
                  )}
                </div>
              )}
            </div>

            {/* Vertical connector line */}
            {!isLast && orientation === 'vertical' && (
              <div className="ml-4 mt-2 mb-2 w-0.5 h-6 bg-neutral-300" />
            )}

            {/* Step label for horizontal orientation */}
            {orientation === 'horizontal' && (
              <div className="text-center mt-2">
                <p
                  className={`text-sm font-medium
                    ${status === 'complete' ? 'text-primary-600' : ''}
                    ${status === 'current' ? 'text-primary-600' : ''}
                    ${status === 'upcoming' ? 'text-neutral-500' : ''}
                  `}
                >
                  {step.label}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}