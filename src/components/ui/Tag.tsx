import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

type TagSize = 'xs' | 'sm' | 'md' | 'lg';
type TagVariant = 'solid' | 'outline' | 'subtle';
type TagColor = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

interface TagProps {
  /**
   * The content of the tag
   */
  children: ReactNode;
  /**
   * The size of the tag
   */
  size?: TagSize;
  /**
   * The variant of the tag
   */
  variant?: TagVariant;
  /**
   * The color of the tag
   */
  color?: TagColor;
  /**
   * Whether the tag is closable
   */
  closable?: boolean;
  /**
   * Callback when the tag is closed
   */
  onClose?: () => void;
  /**
   * Icon to display before the content
   */
  icon?: ReactNode;
  /**
   * Whether the tag is rounded
   */
  rounded?: boolean;
  /**
   * Custom class name
   */
  className?: string;
}

export function Tag({
  children,
  size = 'md',
  variant = 'solid',
  color = 'default',
  closable = false,
  onClose,
  icon,
  rounded = false,
  className = '',
}: TagProps) {
  // Size classes
  const sizeClasses = {
    xs: 'text-xs py-0.5 px-1.5',
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-2.5',
    lg: 'text-base py-1.5 px-3',
  };

  // Icon size classes
  const iconSizeClasses = {
    xs: 'w-3 h-3 mr-1',
    sm: 'w-3.5 h-3.5 mr-1',
    md: 'w-4 h-4 mr-1.5',
    lg: 'w-5 h-5 mr-2',
  };

  // Close button size classes
  const closeSizeClasses = {
    xs: 'w-3 h-3 ml-1',
    sm: 'w-3.5 h-3.5 ml-1',
    md: 'w-4 h-4 ml-1.5',
    lg: 'w-5 h-5 ml-2',
  };

  // Color and variant classes
  const getColorClasses = () => {
    switch (variant) {
      case 'solid':
        switch (color) {
          case 'primary':
            return 'bg-primary-500 text-white';
          case 'success':
            return 'bg-green-500 text-white';
          case 'warning':
            return 'bg-yellow-500 text-white';
          case 'error':
            return 'bg-red-500 text-white';
          case 'info':
            return 'bg-blue-500 text-white';
          default:
            return 'bg-neutral-200 text-neutral-700';
        }
      case 'outline':
        switch (color) {
          case 'primary':
            return 'border border-primary-500 text-primary-700';
          case 'success':
            return 'border border-green-500 text-green-700';
          case 'warning':
            return 'border border-yellow-500 text-yellow-700';
          case 'error':
            return 'border border-red-500 text-red-700';
          case 'info':
            return 'border border-blue-500 text-blue-700';
          default:
            return 'border border-neutral-300 text-neutral-700';
        }
      case 'subtle':
        switch (color) {
          case 'primary':
            return 'bg-primary-50 text-primary-700';
          case 'success':
            return 'bg-green-50 text-green-700';
          case 'warning':
            return 'bg-yellow-50 text-yellow-700';
          case 'error':
            return 'bg-red-50 text-red-700';
          case 'info':
            return 'bg-blue-50 text-blue-700';
          default:
            return 'bg-neutral-100 text-neutral-700';
        }
      default:
        return 'bg-neutral-200 text-neutral-700';
    }
  };

  // Handle close button click
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.();
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${sizeClasses[size]}
        ${getColorClasses()}
        ${rounded ? 'rounded-full' : 'rounded-md'}
        ${className}
      `}
    >
      {icon && <span className={iconSizeClasses[size]}>{icon}</span>}
      {children}
      {closable && (
        <button
          type="button"
          className={`
            inline-flex items-center justify-center
            rounded-full
            hover:bg-black hover:bg-opacity-10
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-transparent
            ${closeSizeClasses[size]}
          `}
          onClick={handleClose}
          aria-label="Close"
        >
          <X className="w-full h-full" />
        </button>
      )}
    </span>
  );
}

// TagGroup component for managing multiple tags
interface TagGroupProps {
  /**
   * The children of the tag group
   */
  children: ReactNode;
  /**
   * The spacing between tags
   */
  spacing?: 'sm' | 'md' | 'lg';
  /**
   * Custom class name
   */
  className?: string;
}

export function TagGroup({
  children,
  spacing = 'md',
  className = '',
}: TagGroupProps) {
  // Spacing classes
  const spacingClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3',
  };

  return (
    <div className={`flex flex-wrap ${spacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  );
}