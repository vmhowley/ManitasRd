import React, { type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ChipProps {
  /**
   * The content of the chip
   */
  children: ReactNode;
  /**
   * The variant of the chip
   */
  variant?: 'filled' | 'outlined' | 'soft';
  /**
   * The color of the chip
   */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  /**
   * The size of the chip
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Whether the chip is disabled
   */
  disabled?: boolean;
  /**
   * Whether the chip is clickable
   */
  clickable?: boolean;
  /**
   * Whether to show a delete icon
   */
  deletable?: boolean;
  /**
   * Icon to display at the start of the chip
   */
  startIcon?: ReactNode;
  /**
   * Icon to display at the end of the chip
   */
  endIcon?: ReactNode;
  /**
   * Callback when the chip is clicked
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /**
   * Callback when the delete icon is clicked
   */
  onDelete?: (event: React.MouseEvent<SVGSVGElement>) => void;
  /**
   * Custom class name
   */
  className?: string;
}

export function Chip({
  children,
  variant = 'filled',
  color = 'default',
  size = 'md',
  disabled = false,
  clickable = false,
  deletable = false,
  startIcon,
  endIcon,
  onClick,
  onDelete,
  className = '',
}: ChipProps) {
  // Handle click
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onClick?.(event);
  };

  // Handle delete
  const handleDelete = (event: React.MouseEvent<SVGSVGElement>) => {
    if (disabled) return;
    event.stopPropagation();
    onDelete?.(event);
  };

  // Get color classes based on variant and color
  const getColorClasses = () => {
    const colorMap = {
      default: {
        filled: 'bg-gray-200 text-gray-800',
        outlined: 'border border-gray-300 text-gray-800',
        soft: 'bg-gray-100 text-gray-800',
      },
      primary: {
        filled: 'bg-blue-500 text-white',
        outlined: 'border border-blue-500 text-blue-500',
        soft: 'bg-blue-100 text-blue-800',
      },
      secondary: {
        filled: 'bg-purple-500 text-white',
        outlined: 'border border-purple-500 text-purple-500',
        soft: 'bg-purple-100 text-purple-800',
      },
      success: {
        filled: 'bg-green-500 text-white',
        outlined: 'border border-green-500 text-green-500',
        soft: 'bg-green-100 text-green-800',
      },
      warning: {
        filled: 'bg-yellow-500 text-white',
        outlined: 'border border-yellow-500 text-yellow-500',
        soft: 'bg-yellow-100 text-yellow-800',
      },
      error: {
        filled: 'bg-red-500 text-white',
        outlined: 'border border-red-500 text-red-500',
        soft: 'bg-red-100 text-red-800',
      },
      info: {
        filled: 'bg-sky-500 text-white',
        outlined: 'border border-sky-500 text-sky-500',
        soft: 'bg-sky-100 text-sky-800',
      },
    };

    return colorMap[color][variant];
  };

  // Get size classes
  const getSizeClasses = () => {
    const sizeMap = {
      sm: 'text-xs px-2 py-0.5 h-6',
      md: 'text-sm px-2.5 py-1 h-8',
      lg: 'text-base px-3 py-1.5 h-10',
    };

    return sizeMap[size];
  };

  // Chip classes
  const chipClasses = `
    chip
    inline-flex
    items-center
    justify-center
    rounded-full
    font-medium
    transition-colors
    ${getColorClasses()}
    ${getSizeClasses()}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${clickable && !disabled ? 'cursor-pointer hover:opacity-80' : ''}
    ${className}
  `;

  return (
    <div
      className={chipClasses}
      onClick={clickable || onClick ? handleClick : undefined}
      role={clickable || onClick ? 'button' : undefined}
      tabIndex={clickable || onClick ? 0 : undefined}
      aria-disabled={disabled}
    >
      {startIcon && <span className="mr-1.5">{startIcon}</span>}
      <span>{children}</span>
      {endIcon && <span className="ml-1.5">{endIcon}</span>}
      {deletable && (
        <X
          className={`
            ml-1.5
            ${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'}
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}
          `}
          onClick={handleDelete}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

interface ChipGroupProps {
  /**
   * The children of the chip group
   */
  children: ReactNode;
  /**
   * The direction of the chip group
   */
  direction?: 'row' | 'column';
  /**
   * The spacing between chips
   */
  spacing?: 'sm' | 'md' | 'lg';
  /**
   * Custom class name
   */
  className?: string;
}

export function ChipGroup({
  children,
  direction = 'row',
  spacing = 'md',
  className = '',
}: ChipGroupProps) {
  // Get spacing classes
  const getSpacingClasses = () => {
    const spacingMap = {
      sm: direction === 'row' ? 'space-x-1' : 'space-y-1',
      md: direction === 'row' ? 'space-x-2' : 'space-y-2',
      lg: direction === 'row' ? 'space-x-3' : 'space-y-3',
    };

    return spacingMap[spacing];
  };

  // Group classes
  const groupClasses = `
    chip-group
    flex
    ${direction === 'row' ? 'flex-row' : 'flex-col'}
    flex-wrap
    ${getSpacingClasses()}
    ${className}
  `;

  return <div className={groupClasses}>{children}</div>;
}