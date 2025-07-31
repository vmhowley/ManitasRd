import { useState, useEffect } from 'react';

interface RadioProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  labelPosition?: 'left' | 'right';
  error?: string;
  helperText?: string;
  className?: string;
  radioClassName?: string;
  labelClassName?: string;
  id?: string;
  name?: string;
  value?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Radio({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  required = false,
  label,
  labelPosition = 'right',
  error,
  helperText,
  className = '',
  radioClassName = '',
  labelClassName = '',
  id,
  name,
  value,
  size = 'md',
}: RadioProps) {
  // Support both controlled and uncontrolled modes
  const [isChecked, setIsChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const radioChecked = isControlled ? checked : isChecked;

  // Update internal state when controlled prop changes
  useEffect(() => {
    if (isControlled) {
      setIsChecked(checked);
    }
  }, [checked, isControlled]);

  // Handle radio change
  const handleChange = () => {
    if (disabled) return;

    const newChecked = true; // Radio buttons can only be checked, not unchecked
    if (!isControlled) {
      setIsChecked(newChecked);
    }
    onChange?.(newChecked);
  };

  // Size classes
  const sizeClasses = {
    sm: {
      radio: 'h-3.5 w-3.5',
      dot: 'h-1.5 w-1.5',
      text: 'text-sm',
    },
    md: {
      radio: 'h-4 w-4',
      dot: 'h-2 w-2',
      text: 'text-base',
    },
    lg: {
      radio: 'h-5 w-5',
      dot: 'h-2.5 w-2.5',
      text: 'text-lg',
    },
  };

  // Generate a unique ID if not provided
  const radioId = id || `radio-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`${className}`}>
      <div
        className={`flex items-center ${labelPosition === 'left' ? 'flex-row-reverse justify-end' : 'justify-start'}`}
      >
        {/* Radio */}
        <div className="relative flex items-center">
          <input
            type="radio"
            id={radioId}
            name={name}
            value={value}
            checked={radioChecked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error || helperText ? `${radioId}-description` : undefined}
            className="sr-only"
          />
          <div
            onClick={handleChange}
            className={`
              flex items-center justify-center
              rounded-full border
              transition-all duration-200 ease-in-out
              ${radioChecked ? 'border-primary-600 dark:border-primary-500' : 'border-neutral-300 dark:border-neutral-700'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary-400 dark:hover:border-primary-500'}
              ${error ? 'border-error-600 dark:border-error-500 hover:border-error-600 dark:hover:border-error-400' : ''}
              ${sizeClasses[size].radio}
              ${radioClassName}
            `}
            aria-hidden="true"
          >
            {radioChecked && (
              <div
                className={`
                  rounded-full bg-primary-600 dark:bg-primary-500
                  ${sizeClasses[size].dot}
                  transition-all duration-200 ease-in-out
                `}
              />
            )}
          </div>
        </div>

        {/* Label */}
        {label && (
          <label
            htmlFor={radioId}
            className={`
              ${labelPosition === 'left' ? 'mr-2' : 'ml-2'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${error ? 'text-error-600 dark:text-error-400' : 'text-neutral-800 dark:text-neutral-200'}
              ${sizeClasses[size].text}
              transition-colors
              ${labelClassName}
            `}
          >
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
      </div>

      {/* Error message or helper text */}
      {(error || helperText) && (
        <p
          id={`${radioId}-description`}
          className={`mt-1.5 ${sizeClasses[size].text === 'text-sm' ? 'text-xs' : 'text-sm'} ${error ? 'text-error-600 dark:text-error-400 font-medium animate-in fade-in duration-300' : 'text-neutral-500 dark:text-neutral-400'} transition-colors`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

// Radio group component
interface RadioOption {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  direction?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}

export function RadioGroup({
  options,
  value,
  defaultValue = '',
  onChange,
  name,
  label,
  required = false,
  error,
  helperText,
  className = '',
  direction = 'vertical',
  size = 'md',
}: RadioGroupProps) {
  // Support both controlled and uncontrolled modes
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : selectedValue;

  // Update internal state when controlled prop changes
  useEffect(() => {
    if (isControlled) {
      setSelectedValue(value);
    }
  }, [value, isControlled]);

  // Handle radio change
  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setSelectedValue(newValue);
    }
    onChange?.(newValue);
  };

  // Generate a unique ID for the group
  const groupId = `radio-group-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={className} role="radiogroup" aria-labelledby={label ? `${groupId}-label` : undefined}>
      {/* Group label */}
      {label && (
        <div
          id={`${groupId}-label`}
          className={`block text-sm font-medium mb-1.5 ${error ? 'text-error-600 dark:text-error-400' : 'text-neutral-800 dark:text-neutral-200'} transition-colors`}
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </div>
      )}

      {/* Radio buttons */}
      <div
        className={`
          ${direction === 'horizontal' ? 'flex flex-row flex-wrap gap-4' : 'flex flex-col space-y-2'}
        `}
      >
        {options.map((option) => (
          <Radio
            key={option.id}
            id={option.id}
            name={name}
            label={option.label}
            value={option.value}
            checked={currentValue === option.value}
            onChange={() => handleChange(option.value)}
            disabled={option.disabled}
            size={size}
          />
        ))}
      </div>

      {/* Error message or helper text */}
      {(error || helperText) && (
        <p
          id={`${groupId}-description`}
          className={`mt-1.5 ${size === 'sm' ? 'text-xs' : 'text-sm'} ${error ? 'text-error-600 dark:text-error-400 font-medium animate-in fade-in duration-300' : 'text-neutral-500 dark:text-neutral-400'} transition-colors`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}