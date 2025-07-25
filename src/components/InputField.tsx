import React, { type ComponentType, forwardRef } from 'react';
import { Input } from './ui/Input';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: ComponentType<{ className?: string }>;
  label?: string;
  error?: string;
}

// This component is maintained for backward compatibility
// It uses the new Input component internally
export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ icon: Icon, label, error, ...props }, ref) => {
    const leftIcon = Icon ? <Icon className="h-5 w-5" /> : undefined;

    return (
      <Input
        ref={ref}
        label={label}
        error={error}
        leftIcon={leftIcon}
        {...props}
      />
    );
  }
);

InputField.displayName = 'InputField';
