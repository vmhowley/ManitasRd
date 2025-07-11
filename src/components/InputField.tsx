import React, { type ComponentType, forwardRef } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: ComponentType<{ className?: string }>;
  label?: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ icon: Icon, label, error, ...props }, ref) => {
    const hasError = !!error;

    return (
      <div>
        {label && (
          <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon className="h-5 w-5 text-gray-500" />
            </div>
          )}
          <input
            {...props}
            ref={ref}
            className={`block w-full rounded-lg border-gray-300 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${Icon ? 'pl-10' : 'px-4'} placeholder-gray-600 ${hasError ? 'border-red-500 ring-red-500' : ''}`}
          />
        </div>
        {hasError && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
