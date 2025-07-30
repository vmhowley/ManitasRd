import { createContext, useContext, type ReactNode } from 'react';

// Types
type TimelineVariant = 'default' | 'alternate' | 'compact';
type TimelineSize = 'sm' | 'md' | 'lg';
type TimelineAlignment = 'left' | 'right' | 'center';

// Context interface
interface TimelineContextValue {
  variant: TimelineVariant;
  size: TimelineSize;
  alignment: TimelineAlignment;
}

// Create context
const TimelineContext = createContext<TimelineContextValue | null>(null);

// Hook to use timeline context
function useTimelineContext() {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error('Timeline compound components must be used within a Timeline component');
  }
  return context;
}

// Timeline props
interface TimelineProps {
  /**
   * The variant of the timeline
   */
  variant?: TimelineVariant;
  /**
   * The size of the timeline
   */
  size?: TimelineSize;
  /**
   * The alignment of the timeline
   */
  alignment?: TimelineAlignment;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * The children of the timeline
   */
  children: ReactNode;
}

// Main Timeline component
export function Timeline({
  variant = 'default',
  size = 'md',
  alignment = 'left',
  className = '',
  children,
}: TimelineProps) {
  // Context value
  const contextValue = {
    variant,
    size,
    alignment,
  };

  return (
    <TimelineContext.Provider value={contextValue}>
      <div
        className={`timeline relative ${className}`}
        role="list"
      >
        {children}
      </div>
    </TimelineContext.Provider>
  );
}

// TimelineItem props
interface TimelineItemProps {
  /**
   * Custom class name
   */
  className?: string;
  /**
   * The children of the timeline item
   */
  children: ReactNode;
}

// TimelineItem component
export function TimelineItem({ className = '', children }: TimelineItemProps) {
  const { variant, alignment } = useTimelineContext();

  // Determine the layout based on variant and alignment
  const getItemClasses = () => {
    if (variant === 'alternate') {
      return 'flex even:flex-row-reverse';
    } else if (variant === 'compact') {
      return 'flex';
    } else {
      // Default variant
      switch (alignment) {
        case 'right':
          return 'flex flex-row-reverse';
        case 'center':
          return 'flex flex-col items-center';
        default: // left
          return 'flex';
      }
    }
  };

  return (
    <div
      className={`timeline-item relative ${getItemClasses()} ${className}`}
      role="listitem"
    >
      {children}
    </div>
  );
}

// TimelineSeparator props
interface TimelineSeparatorProps {
  /**
   * Custom class name
   */
  className?: string;
  /**
   * The children of the timeline separator
   */
  children: ReactNode;
}

// TimelineSeparator component
export function TimelineSeparator({ className = '', children }: TimelineSeparatorProps) {
  const { variant, size, alignment } = useTimelineContext();

  // Size classes
  const sizeClasses = {
    sm: 'mx-2',
    md: 'mx-3',
    lg: 'mx-4',
  };

  // Determine the layout based on variant and alignment
  const getSeparatorClasses = () => {
    if (variant === 'compact') {
      return `${sizeClasses[size]} flex flex-col items-center`;
    } else if (alignment === 'center') {
      return 'py-2 flex flex-row items-center';
    } else {
      return `${sizeClasses[size]} flex flex-col items-center`;
    }
  };

  return (
    <div className={`timeline-separator ${getSeparatorClasses()} ${className}`}>
      {children}
    </div>
  );
}

// TimelineDot props
interface TimelineDotProps {
  /**
   * The color of the dot
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'default';
  /**
   * The variant of the dot
   */
  variant?: 'filled' | 'outlined';
  /**
   * Custom class name
   */
  className?: string;
  /**
   * The children of the timeline dot
   */
  children?: ReactNode;
}

// TimelineDot component
export function TimelineDot({
  color = 'primary',
  variant = 'filled',
  className = '',
  children,
}: TimelineDotProps) {
  const { size } = useTimelineContext();

  // Size classes
  const sizeClasses = {
    sm: children ? 'h-6 w-6 text-xs' : 'h-3 w-3',
    md: children ? 'h-8 w-8 text-sm' : 'h-4 w-4',
    lg: children ? 'h-10 w-10 text-base' : 'h-5 w-5',
  };

  // Color classes
  const getColorClasses = () => {
    const baseClasses = 'flex items-center justify-center rounded-full';
    
    if (variant === 'outlined') {
      switch (color) {
        case 'primary':
          return `${baseClasses} border-2 border-primary-500 text-primary-500`;
        case 'secondary':
          return `${baseClasses} border-2 border-purple-500 text-purple-500`;
        case 'success':
          return `${baseClasses} border-2 border-green-500 text-green-500`;
        case 'warning':
          return `${baseClasses} border-2 border-yellow-500 text-yellow-500`;
        case 'error':
          return `${baseClasses} border-2 border-red-500 text-red-500`;
        case 'info':
          return `${baseClasses} border-2 border-blue-500 text-blue-500`;
        default:
          return `${baseClasses} border-2 border-neutral-500 text-neutral-500`;
      }
    } else {
      // Filled variant
      switch (color) {
        case 'primary':
          return `${baseClasses} bg-primary-500 text-white`;
        case 'secondary':
          return `${baseClasses} bg-purple-500 text-white`;
        case 'success':
          return `${baseClasses} bg-green-500 text-white`;
        case 'warning':
          return `${baseClasses} bg-yellow-500 text-white`;
        case 'error':
          return `${baseClasses} bg-red-500 text-white`;
        case 'info':
          return `${baseClasses} bg-blue-500 text-white`;
        default:
          return `${baseClasses} bg-neutral-500 text-white`;
      }
    }
  };

  return (
    <div
      className={`timeline-dot ${sizeClasses[size]} ${getColorClasses()} ${className}`}
    >
      {children}
    </div>
  );
}

// TimelineConnector props
interface TimelineConnectorProps {
  /**
   * Custom class name
   */
  className?: string;
}

// TimelineConnector component
export function TimelineConnector({ className = '' }: TimelineConnectorProps) {
  const { size, alignment } = useTimelineContext();

  // Size classes
  const sizeClasses = {
    sm: alignment === 'center' ? 'h-px w-10' : 'w-px h-10',
    md: alignment === 'center' ? 'h-px w-16' : 'w-px h-16',
    lg: alignment === 'center' ? 'h-px w-20' : 'w-px h-20',
  };

  return (
    <span
      className={`timeline-connector bg-neutral-300 ${sizeClasses[size]} ${className}`}
    />
  );
}

// TimelineContent props
interface TimelineContentProps {
  /**
   * Custom class name
   */
  className?: string;
  /**
   * The children of the timeline content
   */
  children: ReactNode;
}

// TimelineContent component
export function TimelineContent({ className = '', children }: TimelineContentProps) {
  const { size, variant, alignment } = useTimelineContext();

  // Size classes
  const sizeClasses = {
    sm: 'py-1 px-2',
    md: 'py-2 px-3',
    lg: 'py-3 px-4',
  };

  // Determine the layout based on variant and alignment
  const getContentClasses = () => {
    if (variant === 'compact') {
      return 'flex-1';
    } else if (alignment === 'center') {
      return 'text-center mt-2';
    } else {
      return 'flex-1';
    }
  };

  return (
    <div className={`timeline-content ${sizeClasses[size]} ${getContentClasses()} ${className}`}>
      {children}
    </div>
  );
}

// TimelineOppositeContent props
interface TimelineOppositeContentProps {
  /**
   * Custom class name
   */
  className?: string;
  /**
   * The children of the timeline opposite content
   */
  children: ReactNode;
}

// TimelineOppositeContent component
export function TimelineOppositeContent({ className = '', children }: TimelineOppositeContentProps) {
  const { size, variant, alignment } = useTimelineContext();

  // Size classes
  const sizeClasses = {
    sm: 'py-1 px-2',
    md: 'py-2 px-3',
    lg: 'py-3 px-4',
  };

  // Only render in certain variants and alignments
  if (variant === 'compact' || alignment === 'center') {
    return null;
  }

  return (
    <div className={`timeline-opposite-content flex-1 text-right ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}

// Export all components
export { TimelineContext, useTimelineContext };