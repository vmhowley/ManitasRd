import { useState, useEffect } from 'react';
import { Check, Minus } from 'lucide-react';

interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  labelPosition?: 'left' | 'right';
  error?: string;
  helperText?: string;
  className?: string;
  checkboxClassName?: string;
  labelClassName?: string;
  id?: string;
  name?: string;
  value?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Checkbox({
  checked,
  defaultChecked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  required = false,
  label,
  labelPosition = 'right',
  error,
  helperText,
  className = '',
  checkboxClassName = '',
  labelClassName = '',
  id,
  name,
  value,
  size = 'md',
}: CheckboxProps) {
  // Support both controlled and uncontrolled modes
  const [isChecked, setIsChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const checkboxChecked = isControlled ? checked : isChecked;

  // Update internal state when controlled prop changes
  useEffect(() => {
    if (isControlled) {
      setIsChecked(checked);
    }
  }, [checked, isControlled]);

  // Handle checkbox change
  const handleChange = () => {
    if (disabled) return;

    const newChecked = !checkboxChecked;
    if (!isControlled) {
      setIsChecked(newChecked);
    }
    onChange?.(newChecked);
  };

  // Size classes
  const sizeClasses = {
    sm: {
      checkbox: 'h-3.5 w-3.5',
      icon: 'h-2.5 w-2.5',
      text: 'text-sm',
    },
    md: {
      checkbox: 'h-4 w-4',
      icon: 'h-3 w-3',
      text: 'text-base',
    },
    lg: {
      checkbox: 'h-5 w-5',
      icon: 'h-4 w-4',
      text: 'text-lg',
    },
  };

  // Generate a unique ID if not provided
  const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`${className}`}>
      <div
        className={`flex items-center ${labelPosition === 'left' ? 'flex-row-reverse justify-end' : 'justify-start'}`}
      >
        {/* Checkbox */}
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={checkboxId}
            name={name}
            value={value}
            checked={checkboxChecked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error || helperText ? `${checkboxId}-description` : undefined}
            className="sr-only"
          />
          <div
            onClick={handleChange}
            className={`
              flex items-center justify-center
              rounded-md border
              transition-all duration-200 ease-in-out
              ${checkboxChecked || indeterminate ? 'bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500' : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary-400 dark:hover:border-primary-500'}
              ${error ? 'border-error-600 dark:border-error-500 hover:border-error-600 dark:hover:border-error-400' : ''}
              shadow-sm
              ${sizeClasses[size].checkbox}
              ${checkboxClassName}
            `}
            aria-hidden="true"
          >
            {indeterminate ? (
              <Minus className={`text-white dark:text-neutral-100 ${sizeClasses[size].icon} transition-all duration-200 ease-in-out`} />
            ) : checkboxChecked ? (
              <Check className={`text-white dark:text-neutral-100 ${sizeClasses[size].icon} transition-all duration-200 ease-in-out`} />
            ) : null}
          </div>
        </div>

        {/* Label */}
        {label && (
          <label
            htmlFor={checkboxId}
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
            {required && <span className="text-error-600 dark:text-error-400 ml-1">*</span>}
          </label>
        )}
      </div>

      {/* Error message or helper text */}
      {(error || helperText) && (
        <p
          id={`${checkboxId}-description`}
          className={`mt-1.5 ${sizeClasses[size].text === 'text-sm' ? 'text-xs' : 'text-sm'} ${error ? 'text-error-600 dark:text-error-400 font-medium animate-in fade-in duration-300' : 'text-neutral-500 dark:text-neutral-400'} transition-colors`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

// Checkbox group component
interface CheckboxOption {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  values: string[];
  onChange: (values: string[]) => void;
  name?: string;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  direction?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}

export function CheckboxGroup({
  options,
  values,
  onChange,
  name,
  label,
  required = false,
  error,
  helperText,
  className = '',
  direction = 'vertical',
  size = 'md',
}: CheckboxGroupProps) {
  const handleChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...values, value]);
    } else {
      onChange(values.filter((v) => v !== value));
    }
  };

  // Generate a unique ID for the group
  const groupId = `checkbox-group-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={className} role="group" aria-labelledby={label ? `${groupId}-label` : undefined}>
      {/* Group label */}
      {label && (
        <div
          id={`${groupId}-label`}
          className={`block text-sm font-medium mb-1.5 ${error ? 'text-error-600 dark:text-error-400' : 'text-neutral-800 dark:text-neutral-200'} transition-colors`}
        >
          {label}
          {required && <span className="text-error-600 dark:text-error-400 ml-1">*</span>}
        </div>
      )}

      {/* Checkboxes */}
      <div
        className={`
          ${direction === 'horizontal' ? 'flex flex-row flex-wrap gap-4' : 'flex flex-col space-y-2'}
        `}
      >
        {options.map((option) => (
          <Checkbox
            key={option.id}
            id={option.id}
            name={name}
            label={option.label}
            value={option.value}
            checked={values.includes(option.value)}
            onChange={(checked) => handleChange(option.value, checked)}
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