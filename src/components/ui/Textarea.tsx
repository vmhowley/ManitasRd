import React, { useState, useEffect, useRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  className?: string;
  textareaClassName?: string;
  id?: string;
  name?: string;
  rows?: number;
  maxRows?: number;
  minRows?: number;
  autoResize?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
}

export function Textarea({
  value,
  defaultValue = '',
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  readOnly = false,
  required = false,
  error,
  label,
  helperText,
  className = '',
  textareaClassName = '',
  id,
  name,
  rows = 3,
  maxRows,
  minRows,
  autoResize = false,
  size = 'md',
  fullWidth = false,
  maxLength,
  showCharacterCount = false,
  ...rest
}: TextareaProps) {
  // Support both controlled and uncontrolled modes
  const [inputValue, setInputValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : inputValue;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update internal state when controlled prop changes
  useEffect(() => {
    if (isControlled) {
      setInputValue(value);
    }
  }, [value, isControlled]);

  // Auto-resize functionality
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      const textarea = textareaRef.current;
      
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate new height
      let newHeight = textarea.scrollHeight;
      
      // Apply min/max constraints if specified
      if (minRows) {
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
        const minHeight = minRows * lineHeight;
        newHeight = Math.max(newHeight, minHeight);
      }
      
      if (maxRows) {
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
        const maxHeight = maxRows * lineHeight;
        newHeight = Math.min(newHeight, maxHeight);
      }
      
      textarea.style.height = `${newHeight}px`;
    }
  }, [currentValue, autoResize, minRows, maxRows]);

  // Handle textarea change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) {
      setInputValue(e.target.value);
    }
    onChange?.(e);
  };

  // Size classes
  const sizeClasses = {
    sm: {
      textarea: 'px-2 py-1 text-sm',
      label: 'text-xs',
    },
    md: {
      textarea: 'px-3 py-2 text-base',
      label: 'text-sm',
    },
    lg: {
      textarea: 'px-4 py-3 text-lg',
      label: 'text-base',
    },
  };

  // Generate a unique ID if not provided
  const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

  // Calculate character count and limit
  const characterCount = currentValue?.length || 0;
  const isAtMaxLength = maxLength !== undefined && characterCount >= maxLength;

  return (
    <div className={`${fullWidth ? 'w-full' : 'w-auto'} ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={textareaId}
          className={`block ${sizeClasses[size].label} font-medium mb-1 ${error ? 'text-error-500' : 'text-neutral-700'}`}
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          id={textareaId}
          name={name}
          value={currentValue}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          rows={rows}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={
            (error || helperText || (showCharacterCount && maxLength))
              ? `${textareaId}-description`
              : undefined
          }
          className={`
            block w-full rounded-md
            transition-colors duration-200
            ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500'}
            ${disabled ? 'bg-neutral-100 cursor-not-allowed opacity-75' : 'bg-white'}
            ${readOnly ? 'bg-neutral-50' : ''}
            ${isAtMaxLength ? 'border-warning-500' : ''}
            ${sizeClasses[size].textarea}
            ${textareaClassName}
            focus:outline-none focus:ring-1
          `}
          style={{
            resize: autoResize ? 'none' : 'vertical',
          }}
          {...rest}
        />
      </div>

      {/* Character count and/or helper text */}
      {(error || helperText || (showCharacterCount && maxLength)) && (
        <div
          id={`${textareaId}-description`}
          className="mt-1 flex justify-between items-center"
        >
          <div className={`${sizeClasses[size].label} ${error ? 'text-error-500' : 'text-neutral-500'}`}>
            {error || helperText}
          </div>
          
          {showCharacterCount && maxLength && (
            <div
              className={`
                ${sizeClasses[size].label}
                ${isAtMaxLength ? 'text-warning-500 font-medium' : 'text-neutral-500'}
                ml-2 tabular-nums
              `}
            >
              {characterCount}/{maxLength}
            </div>
          )}
        </div>
      )}
    </div>
  );
}