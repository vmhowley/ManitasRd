import React, { useState } from 'react';
import { Star } from 'lucide-react';

type RatingSize = 'sm' | 'md' | 'lg';
type RatingVariant = 'filled' | 'outline';

interface RatingProps {
  /**
   * The current rating value
   */
  value?: number;
  /**
   * Default value for uncontrolled usage
   */
  defaultValue?: number;
  /**
   * Callback when rating changes
   */
  onChange?: (value: number) => void;
  /**
   * The maximum rating value
   */
  max?: number;
  /**
   * Whether the rating is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the rating is disabled
   */
  disabled?: boolean;
  /**
   * Whether to allow half stars
   */
  allowHalf?: boolean;
  /**
   * The size of the rating stars
   */
  size?: RatingSize;
  /**
   * The variant of the rating stars
   */
  variant?: RatingVariant;
  /**
   * The color of the active stars
   */
  activeColor?: string;
  /**
   * The color of the inactive stars
   */
  inactiveColor?: string;
  /**
   * The icon to use for the rating
   */
  icon?: React.ReactNode;
  /**
   * Label for the rating
   */
  label?: string;
  /**
   * Helper text for the rating
   */
  helperText?: string;
  /**
   * Error text for the rating
   */
  errorText?: string;
  /**
   * Whether to show the rating value
   */
  showValue?: boolean;
  /**
   * Custom class name
   */
  className?: string;
}

export function Rating({
  value,
  defaultValue = 0,
  onChange,
  max = 5,
  readOnly = false,
  disabled = false,
  allowHalf = false,
  size = 'md',
  variant = 'filled',
  activeColor = 'text-yellow-400',
  inactiveColor = 'text-neutral-300',
  icon,
  label,
  helperText,
  errorText,
  showValue = false,
  className = '',
}: RatingProps) {
  // State for hover and value
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [internalValue, setInternalValue] = useState<number>(defaultValue);

  // Determine if component is controlled or uncontrolled
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const displayValue = hoverValue !== null ? hoverValue : currentValue;

  // Handle mouse enter on a star
  const handleMouseEnter = (index: number) => {
    if (readOnly || disabled) return;
    setHoverValue(index);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (readOnly || disabled) return;
    setHoverValue(null);
  };

  // Handle click on a star
  const handleClick = (index: number) => {
    if (readOnly || disabled) return;
    
    // Update internal state for uncontrolled usage
    if (!isControlled) {
      setInternalValue(index);
    }
    
    // Call onChange callback
    onChange?.(index);
  };

  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  // Label size classes
  const labelSizeClasses = {
    sm: 'text-xs mb-1',
    md: 'text-sm mb-1',
    lg: 'text-base mb-1.5',
  };

  // Helper text size classes
  const helperTextSizeClasses = {
    sm: 'text-xs mt-1',
    md: 'text-xs mt-1',
    lg: 'text-sm mt-1.5',
  };

  // Render stars
  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= max; i++) {
      // Determine if the star should be active
      const isActive = i <= displayValue;
      // Determine if the star should be half active (only if allowHalf is true)
      const isHalfActive = allowHalf && i === Math.ceil(displayValue) && displayValue % 1 !== 0;
      
      stars.push(
        <span
          key={i}
          className={`rating-star inline-flex ${disabled ? 'cursor-not-allowed opacity-60' : readOnly ? 'cursor-default' : 'cursor-pointer'}`}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
          role={readOnly ? undefined : 'button'}
          tabIndex={readOnly || disabled ? -1 : 0}
          aria-disabled={disabled}
        >
          {icon ? (
            // Use custom icon if provided
            React.cloneElement(icon as React.ReactElement, {
              className: `${sizeClasses[size]} ${isActive ? activeColor : inactiveColor}`,
            })
          ) : (
            // Use default star icon
            <Star
              className={`${sizeClasses[size]} ${isActive ? activeColor : inactiveColor} ${variant === 'outline' ? 'stroke-current fill-transparent' : 'fill-current'}`}
              strokeWidth={variant === 'outline' ? 2 : 1}
            />
          )}
        </span>
      );
    }
    
    return stars;
  };

  return (
    <div className={`rating ${className}`}>
      {/* Label */}
      {label && (
        <div className={`rating-label font-medium ${labelSizeClasses[size]}`}>
          {label}
        </div>
      )}
      
      {/* Stars */}
      <div className="rating-stars flex items-center space-x-1" onMouseLeave={handleMouseLeave}>
        {renderStars()}
        
        {/* Display value */}
        {showValue && (
          <span className={`ml-2 ${errorText ? 'text-red-500' : 'text-neutral-600'}`}>
            {displayValue.toFixed(allowHalf ? 1 : 0)}/{max}
          </span>
        )}
      </div>
      
      {/* Helper or error text */}
      {(helperText || errorText) && (
        <div className={`${helperTextSizeClasses[size]} ${errorText ? 'text-red-500' : 'text-neutral-500'}`}>
          {errorText || helperText}
        </div>
      )}
    </div>
  );
}