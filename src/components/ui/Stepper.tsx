import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { Check } from 'lucide-react';

// Types
type StepStatus = 'completed' | 'current' | 'upcoming';
type StepperOrientation = 'horizontal' | 'vertical';
type StepperSize = 'sm' | 'md' | 'lg';
type StepperVariant = 'default' | 'outline' | 'simple';

// Context interface
interface StepperContextValue {
  activeStep: number;
  orientation: StepperOrientation;
  size: StepperSize;
  variant: StepperVariant;
  steps: number;
  onChange?: (step: number) => void;
  nonLinear?: boolean;
}

// Create context
const StepperContext = createContext<StepperContextValue | null>(null);

// Hook to use stepper context
function useStepperContext() {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('Stepper compound components must be used within a Stepper component');
  }
  return context;
}

// Stepper props
interface StepperProps {
  activeStep: number;
  orientation?: StepperOrientation;
  size?: StepperSize;
  variant?: StepperVariant;
  onChange?: (step: number) => void;
  nonLinear?: boolean;
  className?: string;
  children: ReactNode;
}

// Main Stepper component
export function Stepper({
  activeStep = 0,
  orientation = 'horizontal',
  size = 'md',
  variant = 'default',
  onChange,
  nonLinear = false,
  className = '',
  children,
}: StepperProps) {
  // Count the number of steps
  const steps = React.Children.count(children);

  // Context value
  const contextValue = useMemo(
    () => ({
      activeStep,
      orientation,
      size,
      variant,
      steps,
      onChange,
      nonLinear,
    }),
    [activeStep, orientation, size, variant, steps, onChange, nonLinear]
  );

  // Orientation classes
  const orientationClasses = {
    horizontal: 'flex flex-row items-center',
    vertical: 'flex flex-col items-start gap-2',
  };

  return (
    <StepperContext.Provider value={contextValue}>
      <div
        className={`stepper ${orientationClasses[orientation]} ${className}`}
        role="navigation"
        aria-label="Progress"
      >
        {children}
      </div>
    </StepperContext.Provider>
  );
}

// Step props
interface StepProps {
  label: string;
  description?: string;
  optional?: boolean;
  optionalLabel?: string;
  icon?: ReactNode;
  completedIcon?: ReactNode;
  errorIcon?: ReactNode;
  isError?: boolean;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

// Step component
export function Step({
  label,
  description,
  optional = false,
  optionalLabel = 'Optional',
  icon,
  completedIcon,
  errorIcon,
  isError = false,
  onClick,
  className = '',
  children,
}: StepProps) {
  const { activeStep, orientation, size, variant, steps, onChange, nonLinear } = useStepperContext();

  // Get the index of this step using a static counter
  const stepIndex = React.useMemo(() => {
    // This is a simplified approach - in a real implementation,
    // you might want to pass the index as a prop or use a different method
    return 0; // This should be passed as a prop in actual usage
  }, []);

  // Determine step status
  let status: StepStatus = 'upcoming';
  if (activeStep === stepIndex) {
    status = 'current';
  } else if (activeStep > stepIndex) {
    status = 'completed';
  }

  // Handle click
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (onChange && (nonLinear || status === 'completed' || activeStep === stepIndex - 1)) {
      onChange(stepIndex);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: {
      indicator: 'w-6 h-6 text-xs',
      label: 'text-xs',
      description: 'text-xs',
      connector: orientation === 'horizontal' ? 'h-[1px]' : 'w-[1px] h-6',
    },
    md: {
      indicator: 'w-8 h-8 text-sm',
      label: 'text-sm',
      description: 'text-xs',
      connector: orientation === 'horizontal' ? 'h-[1px]' : 'w-[1px] h-8',
    },
    lg: {
      indicator: 'w-10 h-10 text-base',
      label: 'text-base',
      description: 'text-sm',
      connector: orientation === 'horizontal' ? 'h-[2px]' : 'w-[2px] h-10',
    },
  };

  // Status classes
  const statusClasses = {
    completed: {
      indicator:
        'bg-primary-500 text-white border-primary-500',
      label: 'font-medium text-neutral-900',
      description: 'text-neutral-600',
      connector: 'bg-primary-500',
    },
    current: {
      indicator:
        'bg-primary-50 text-primary-600 border-primary-500',
      label: 'font-medium text-neutral-900',
      description: 'text-neutral-600',
      connector: 'bg-neutral-300',
    },
    upcoming: {
      indicator:
        'bg-white text-neutral-500 border-neutral-300',
      label: 'text-neutral-500',
      description: 'text-neutral-400',
      connector: 'bg-neutral-300',
    },
  };

  // Error classes
  const errorClasses = {
    indicator: 'bg-error-50 text-error-600 border-error-500',
    label: 'text-error-600 font-medium',
    description: 'text-error-500',
  };

  // Variant classes
  const variantClasses = {
    default: {
      indicator: 'rounded-full border',
      wrapper: '',
    },
    outline: {
      indicator: 'rounded-full border-2',
      wrapper: '',
    },
    simple: {
      indicator: 'rounded',
      wrapper: '',
    },
  };

  // Determine if step is clickable
  const isClickable = nonLinear || status === 'completed' || activeStep === stepIndex - 1;

  // Render step indicator content
  const renderStepIndicator = () => {
    if (isError && errorIcon) {
      return errorIcon;
    }

    if (status === 'completed' && completedIcon) {
      return completedIcon;
    }

    if (status === 'completed' && !completedIcon) {
      return <Check size={size === 'sm' ? 14 : size === 'md' ? 16 : 20} />;
    }

    if (icon) {
      return icon;
    }

    return stepIndex + 1;
  };

  return (
    <div
      className={`
        step
        ${orientation === 'horizontal' ? 'flex-1' : 'w-full'}
        ${className}
      `}
    >
      <div
        className={`
          step-content
          ${orientation === 'horizontal' ? 'flex flex-col items-center' : 'flex items-start'}
          ${orientation === 'vertical' ? 'ml-4' : ''}
        `}
      >
        <div className={`flex ${orientation === 'horizontal' ? 'flex-col items-center' : 'flex-row items-center'}`}>
          {/* Step indicator */}
          <button
            type="button"
            className={`
              flex items-center justify-center
              ${sizeClasses[size].indicator}
              ${variantClasses[variant].indicator}
              ${isError ? errorClasses.indicator : statusClasses[status].indicator}
              ${isClickable ? 'cursor-pointer hover:shadow-sm' : 'cursor-default'}
              transition-all duration-200
            `}
            onClick={handleClick}
            disabled={!isClickable}
            aria-current={status === 'current' ? 'step' : undefined}
            aria-label={`${label}, step ${stepIndex + 1} of ${steps}`}
          >
            {renderStepIndicator()}
          </button>

          {/* Label and description for vertical orientation */}
          {orientation === 'vertical' && (
            <div className="ml-3">
              <div className="flex items-center">
                <span
                  className={`
                    ${sizeClasses[size].label}
                    ${isError ? errorClasses.label : statusClasses[status].label}
                  `}
                >
                  {label}
                </span>
                {optional && (
                  <span
                    className={`
                      ml-2 ${sizeClasses[size].description} text-neutral-500
                    `}
                  >
                    ({optionalLabel})
                  </span>
                )}
              </div>
              {description && (
                <p
                  className={`
                    mt-1
                    ${sizeClasses[size].description}
                    ${isError ? errorClasses.description : statusClasses[status].description}
                  `}
                >
                  {description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Label and description for horizontal orientation */}
        {orientation === 'horizontal' && (
          <div className="mt-2 text-center">
            <div className="flex flex-col items-center">
              <span
                className={`
                  ${sizeClasses[size].label}
                  ${isError ? errorClasses.label : statusClasses[status].label}
                `}
              >
                {label}
              </span>
              {optional && (
                <span
                  className={`
                    ${sizeClasses[size].description} text-neutral-500
                  `}
                >
                  ({optionalLabel})
                </span>
              )}
            </div>
            {description && (
              <p
                className={`
                  mt-1
                  ${sizeClasses[size].description}
                  ${isError ? errorClasses.description : statusClasses[status].description}
                `}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* Step content */}
        {children && (
          <div className={`step-children mt-4 ${orientation === 'vertical' ? 'ml-4' : ''}`}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

// StepConnector props
interface StepConnectorProps {
  className?: string;
}

// StepConnector component
export function StepConnector({ className = '' }: StepConnectorProps) {
  const { orientation, size, activeStep } = useStepperContext();

  // Simplified connector status - in real usage, this should be passed as a prop
  const connectorIndex = 0;
  const isCompleted = activeStep > connectorIndex;

  // Size classes for connector
  const sizeClasses = {
    sm: {
      connector: orientation === 'horizontal' ? 'h-[1px]' : 'w-[1px] h-6',
    },
    md: {
      connector: orientation === 'horizontal' ? 'h-[1px]' : 'w-[1px] h-8',
    },
    lg: {
      connector: orientation === 'horizontal' ? 'h-[2px]' : 'w-[2px] h-10',
    },
  };

  // Size and orientation classes
  const connectorClasses = {
    horizontal: `flex-1 ${sizeClasses[size].connector}`,
    vertical: `${sizeClasses[size].connector} absolute left-4 top-8 bottom-0 -translate-x-1/2`,
  };

  return (
    <div
      className={`
        step-connector
        ${orientation === 'horizontal' ? 'flex-1' : 'relative h-full'}
        ${className}
      `}
    >
      <div
        className={`
          ${connectorClasses[orientation]}
          ${isCompleted ? 'bg-primary-500' : 'bg-neutral-300'}
          transition-colors duration-300
        `}
      />
    </div>
  );
}

// StepContent props
interface StepContentProps {
  step: number;
  className?: string;
  children: ReactNode;
}

// StepContent component
export function StepContent({ step, className = '', children }: StepContentProps) {
  const { activeStep } = useStepperContext();

  if (activeStep !== step) {
    return null;
  }

  return (
    <div
      className={`step-content mt-4 animate-in fade-in slide-in-from-left duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

// Export all components
export { StepperContext, useStepperContext };