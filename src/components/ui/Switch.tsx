import { useState, useEffect } from 'react';

interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  labelPosition?: 'left' | 'right';
  className?: string;
  switchClassName?: string;
  labelClassName?: string;
  id?: string;
  name?: string;
  value?: string;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

export function Switch({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = 'md',
  label,
  labelPosition = 'right',
  className = '',
  switchClassName = '',
  labelClassName = '',
  id,
  name,
  value,
  color = 'primary',
}: SwitchProps) {
  // Support both controlled and uncontrolled modes
  const [isChecked, setIsChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const switchChecked = isControlled ? checked : isChecked;

  // Update internal state when controlled prop changes
  useEffect(() => {
    if (isControlled) {
      setIsChecked(checked);
    }
  }, [checked, isControlled]);

  // Handle toggle
  const handleToggle = () => {
    if (disabled) return;

    const newChecked = !switchChecked;
    if (!isControlled) {
      setIsChecked(newChecked);
    }
    onChange?.(newChecked);
  };

  // Size classes
  const sizeClasses = {
    sm: {
      switch: 'w-8 h-4',
      thumb: 'h-3 w-3',
      translate: 'translate-x-4',
      text: 'text-sm',
    },
    md: {
      switch: 'w-11 h-6',
      thumb: 'h-5 w-5',
      translate: 'translate-x-5',
      text: 'text-base',
    },
    lg: {
      switch: 'w-14 h-7',
      thumb: 'h-6 w-6',
      translate: 'translate-x-7',
      text: 'text-lg',
    },
  };

  // Color classes
  const colorClasses = {
    primary: 'bg-primary-600',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
    info: 'bg-info-500',
  };

  // Generate a unique ID if not provided
  const switchId = id || `switch-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div
      className={`flex items-center ${labelPosition === 'left' ? 'flex-row-reverse justify-end' : 'justify-start'} ${className}`}
    >
      {/* Switch */}
      <button
        type="button"
        role="switch"
        id={switchId}
        aria-checked={switchChecked}
        aria-label={label || 'Toggle'}
        disabled={disabled}
        onClick={handleToggle}
        className={`
          relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2
          focus-visible:ring-offset-2 focus-visible:ring-primary-500
          ${switchChecked ? colorClasses[color] : 'bg-neutral-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${sizeClasses[size].switch}
          ${switchClassName}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block rounded-full bg-white shadow transform
            ring-0 transition duration-200 ease-in-out
            ${switchChecked ? sizeClasses[size].translate : 'translate-x-0'}
            ${sizeClasses[size].thumb}
          `}
          aria-hidden="true"
        />
      </button>

      {/* Label */}
      {label && (
        <label
          htmlFor={switchId}
          className={`
            ${labelPosition === 'left' ? 'mr-3' : 'ml-3'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${sizeClasses[size].text}
            ${labelClassName}
          `}
        >
          {label}
        </label>
      )}

      {/* Hidden input for form submission */}
      {name && (
        <input
          type="checkbox"
          id={`${switchId}-hidden`}
          name={name}
          value={value}
          checked={switchChecked}
          onChange={handleToggle}
          disabled={disabled}
          className="sr-only"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

// Switch Group component for organizing multiple switches
interface SwitchOption {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
}

interface SwitchGroupProps {
  options: SwitchOption[];
  values: string[];
  onChange: (values: string[]) => void;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
  direction?: 'horizontal' | 'vertical';
}

export function SwitchGroup({
  options,
  values,
  onChange,
  name,
  size = 'md',
  color = 'primary',
  className = '',
  direction = 'vertical',
}: SwitchGroupProps) {
  const handleChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...values, value]);
    } else {
      onChange(values.filter((v) => v !== value));
    }
  };

  return (
    <div
      className={`
        ${direction === 'horizontal' ? 'flex flex-row flex-wrap gap-4' : 'flex flex-col space-y-3'}
        ${className}
      `}
      role="group"
    >
      {options.map((option) => (
        <Switch
          key={option.id}
          id={option.id}
          name={name}
          label={option.label}
          value={option.value}
          checked={values.includes(option.value)}
          onChange={(checked) => handleChange(option.value, checked)}
          disabled={option.disabled}
          size={size}
          color={color}
        />
      ))}
    </div>
  );
}