import React, { useState, useRef, useEffect, useCallback } from 'react';

interface SliderProps {
  value?: number | number[];
  defaultValue?: number | number[];
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number | number[]) => void;
  onChangeEnd?: (value: number | number[]) => void;
  disabled?: boolean;
  range?: boolean;
  showTooltip?: boolean | 'always';
  showMarks?: boolean;
  marks?: { value: number; label?: string }[];
  label?: string;
  helperText?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  trackClassName?: string;
  thumbClassName?: string;
  markClassName?: string;
  tooltipClassName?: string;
  formatTooltip?: (value: number) => string;
  id?: string;
}

export function Slider({
  value,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  onChangeEnd,
  disabled = false,
  range = false,
  showTooltip = false,
  showMarks = false,
  marks,
  label,
  helperText,
  error,
  size = 'md',
  className = '',
  trackClassName = '',
  thumbClassName = '',
  markClassName = '',
  tooltipClassName = '',
  formatTooltip,
  id,
}: SliderProps) {
  // Generate a unique ID if not provided
  const sliderId = id || `slider-${Math.random().toString(36).substring(2, 9)}`;

  // Initialize state for controlled/uncontrolled usage
  const [internalValue, setInternalValue] = useState<number | number[]>(() => {
    if (range) {
      return Array.isArray(defaultValue) ? defaultValue : [min, defaultValue as number];
    }
    return Array.isArray(defaultValue) ? defaultValue[0] : defaultValue;
  });

  // Determine if the component is controlled
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  // Refs for DOM elements
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isDraggingRef = useRef<boolean>(false);
  const activeThumbIndexRef = useRef<number>(0);

  // Refs for tooltip visibility
  const [tooltipVisible, setTooltipVisible] = useState<boolean[]>(
    Array.isArray(currentValue) ? currentValue.map(() => false) : [false]
  );

  // Size classes
  const sizeClasses = {
    sm: {
      track: 'h-1',
      thumb: 'w-3 h-3',
      label: 'text-xs',
      tooltip: 'text-xs py-1 px-1.5',
      mark: 'w-1 h-1',
    },
    md: {
      track: 'h-2',
      thumb: 'w-4 h-4',
      label: 'text-sm',
      tooltip: 'text-xs py-1 px-2',
      mark: 'w-1.5 h-1.5',
    },
    lg: {
      track: 'h-3',
      thumb: 'w-5 h-5',
      label: 'text-base',
      tooltip: 'text-sm py-1 px-2',
      mark: 'w-2 h-2',
    },
  };

  // Normalize value to array for consistent handling
  const normalizedValue = Array.isArray(currentValue) ? currentValue : [currentValue];

  // Calculate percentage for positioning
  const calculatePercentage = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  // Calculate value from percentage
  const calculateValueFromPercentage = (percentage: number) => {
    const rawValue = min + (percentage / 100) * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.min(max, Math.max(min, steppedValue));
  };

  // Format value for tooltip
  const formatValue = (val: number) => {
    if (formatTooltip) {
      return formatTooltip(val);
    }
    return val.toString();
  };

  // Handle track click
  const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const percentage = ((event.clientX - rect.left) / rect.width) * 100;
    const newValue = calculateValueFromPercentage(percentage);

    if (range && Array.isArray(currentValue)) {
      // Find the closest thumb to update
      const distances = currentValue.map(val => Math.abs(calculatePercentage(val) - percentage));
      const closestIndex = distances.indexOf(Math.min(...distances));
      activeThumbIndexRef.current = closestIndex;

      const newValues = [...currentValue];
      newValues[closestIndex] = newValue;

      // Ensure values remain in order for range slider
      if (closestIndex === 0 && newValues[0] > newValues[1]) {
        newValues[0] = newValues[1];
      } else if (closestIndex === 1 && newValues[1] < newValues[0]) {
        newValues[1] = newValues[0];
      }

      if (!isControlled) {
        setInternalValue(newValues);
      }
      onChange?.(newValues);
      onChangeEnd?.(newValues);
    } else {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
      onChangeEnd?.(newValue);
    }
  };

  // Handle thumb drag start
  const handleThumbMouseDown = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (disabled) return;

    event.preventDefault();
    isDraggingRef.current = true;
    activeThumbIndexRef.current = index;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle mouse move during drag
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDraggingRef.current || !trackRef.current) return;

      const track = trackRef.current;
      const rect = track.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
      const newValue = calculateValueFromPercentage(percentage);

      if (range && Array.isArray(currentValue)) {
        const newValues = [...currentValue];
        const index = activeThumbIndexRef.current;
        newValues[index] = newValue;

        // Ensure values remain in order for range slider
        if (index === 0 && newValues[0] > newValues[1]) {
          newValues[0] = newValues[1];
        } else if (index === 1 && newValues[1] < newValues[0]) {
          newValues[1] = newValues[0];
        }

        if (!isControlled) {
          setInternalValue(newValues);
        }
        onChange?.(newValues);
      } else {
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
      }
    },
    [currentValue, isControlled, min, max, step, range, onChange]
  );

  // Handle mouse up after drag
  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // Trigger onChangeEnd callback
      onChangeEnd?.(currentValue);
    }
  }, [currentValue, onChangeEnd, handleMouseMove]);

  // Handle thumb hover for tooltip
  const handleThumbHover = (index: number, isHovering: boolean) => {
    if (showTooltip === 'always') return;
    if (showTooltip) {
      setTooltipVisible(prev => {
        const newState = [...prev];
        newState[index] = isHovering;
        return newState;
      });
    }
  };

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Generate marks if showMarks is true
  const renderMarks = () => {
    if (!showMarks) return null;

    const markValues = marks || Array.from({ length: (max - min) / step + 1 }, (_, i) => ({
      value: min + i * step,
    })).filter(mark => mark.value % (step * 5) === 0 || mark.value === min || mark.value === max);

    return markValues.map((mark, index) => {
      const percentage = calculatePercentage(mark.value);
      const isActive = normalizedValue.some(val => val >= mark.value);

      return (
        <div
          key={`${mark.value}-${index}`}
          className={`
            absolute -translate-x-1/2 -translate-y-1/2 rounded-full
            ${isActive ? 'bg-primary-500' : 'bg-neutral-300'}
            ${disabled ? 'opacity-50' : ''}
            ${sizeClasses[size].mark}
            ${markClassName}
          `}
          style={{ left: `${percentage}%`, top: '50%' }}
          aria-hidden="true"
        >
          {mark.label && (
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap">
              {mark.label}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={sliderId}
          className={`block mb-2 ${sizeClasses[size].label} font-medium ${error ? 'text-error-500' : 'text-neutral-700'}`}
        >
          {label}
        </label>
      )}

      {/* Slider */}
      <div
        className={`relative py-4 ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handleTrackClick}
        ref={trackRef}
      >
        {/* Background track */}
        <div
          className={`
            absolute top-1/2 left-0 right-0 -translate-y-1/2 rounded-full bg-neutral-200
            ${sizeClasses[size].track}
            ${trackClassName}
          `}
        />

        {/* Active track */}
        {range && Array.isArray(currentValue) ? (
          <div
            className={`
              absolute top-1/2 -translate-y-1/2 rounded-full bg-primary-500
              ${sizeClasses[size].track}
              ${disabled ? 'bg-neutral-400' : ''}
              ${trackClassName}
            `}
            style={{
              left: `${calculatePercentage(currentValue[0])}%`,
              right: `${100 - calculatePercentage(currentValue[1])}%`,
            }}
          />
        ) : (
          <div
            className={`
              absolute top-1/2 -translate-y-1/2 rounded-full bg-primary-500
              ${sizeClasses[size].track}
              ${disabled ? 'bg-neutral-400' : ''}
              ${trackClassName}
            `}
            style={{
              left: 0,
              width: `${calculatePercentage(normalizedValue[0])}%`,
            }}
          />
        )}

        {/* Marks */}
        {renderMarks()}

        {/* Thumbs */}
        {normalizedValue.map((val, index) => (
          <div
            key={index}
            ref={el => (thumbRefs.current[index] = el)}
            className={`
              absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full
              bg-white border-2 border-primary-500 shadow-sm
              ${disabled ? 'border-neutral-400 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}
              ${sizeClasses[size].thumb}
              ${thumbClassName}
            `}
            style={{ left: `${calculatePercentage(val)}%` }}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={val}
            aria-disabled={disabled}
            aria-labelledby={label ? sliderId : undefined}
            onMouseDown={e => handleThumbMouseDown(e, index)}
            onMouseEnter={() => handleThumbHover(index, true)}
            onMouseLeave={() => handleThumbHover(index, false)}
            onFocus={() => handleThumbHover(index, true)}
            onBlur={() => handleThumbHover(index, false)}
            onKeyDown={e => {
              if (disabled) return;
              
              let newValue = val;
              if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                newValue = Math.min(max, val + step);
              } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                newValue = Math.max(min, val - step);
              } else if (e.key === 'Home') {
                newValue = min;
              } else if (e.key === 'End') {
                newValue = max;
              } else {
                return;
              }
              
              e.preventDefault();
              
              if (range && Array.isArray(currentValue)) {
                const newValues = [...currentValue];
                newValues[index] = newValue;
                
                // Ensure values remain in order for range slider
                if (index === 0 && newValues[0] > newValues[1]) {
                  newValues[0] = newValues[1];
                } else if (index === 1 && newValues[1] < newValues[0]) {
                  newValues[1] = newValues[0];
                }
                
                if (!isControlled) {
                  setInternalValue(newValues);
                }
                onChange?.(newValues);
                onChangeEnd?.(newValues);
              } else {
                if (!isControlled) {
                  setInternalValue(newValue);
                }
                onChange?.(newValue);
                onChangeEnd?.(newValue);
              }
            }}
          >
            {/* Tooltip */}
            {(showTooltip === 'always' || tooltipVisible[index]) && (
              <div
                className={`
                  absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                  bg-neutral-800 text-white rounded shadow-sm
                  ${sizeClasses[size].tooltip}
                  ${tooltipClassName}
                `}
              >
                {formatValue(val)}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Helper text or error */}
      {(helperText || error) && (
        <div className={`mt-1 ${sizeClasses[size].label} ${error ? 'text-error-500' : 'text-neutral-500'}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
}