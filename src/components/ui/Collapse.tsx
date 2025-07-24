import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapseProps {
  /**
   * The title of the collapse
   */
  title: ReactNode;
  /**
   * The content of the collapse
   */
  children: ReactNode;
  /**
   * Whether the collapse is open by default
   */
  defaultOpen?: boolean;
  /**
   * Whether the collapse is open (controlled)
   */
  open?: boolean;
  /**
   * Callback when the collapse is toggled
   */
  onToggle?: (isOpen: boolean) => void;
  /**
   * Whether the collapse is disabled
   */
  disabled?: boolean;
  /**
   * The icon to display for the toggle
   */
  icon?: ReactNode;
  /**
   * Whether to show a border around the collapse
   */
  bordered?: boolean;
  /**
   * Whether to show a shadow around the collapse
   */
  shadow?: boolean;
  /**
   * Whether to show a divider between the title and content
   */
  divider?: boolean;
  /**
   * Custom class name for the container
   */
  className?: string;
  /**
   * Custom class name for the title
   */
  titleClassName?: string;
  /**
   * Custom class name for the content
   */
  contentClassName?: string;
}

export function Collapse({
  title,
  children,
  defaultOpen = false,
  open,
  onToggle,
  disabled = false,
  icon,
  bordered = false,
  shadow = false,
  divider = true,
  className = '',
  titleClassName = '',
  contentClassName = '',
}: CollapseProps) {
  // State for controlled/uncontrolled usage
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(defaultOpen ? undefined : 0);

  // Determine if component is controlled or uncontrolled
  const isControlled = open !== undefined;
  const expanded = isControlled ? open : isOpen;

  // Update height when content changes or when open state changes
  useEffect(() => {
    if (expanded) {
      const contentEl = contentRef.current;
      if (contentEl) {
        // Set to auto height first to get the correct scrollHeight
        setContentHeight(undefined);
        // Then in the next frame, capture the scrollHeight
        requestAnimationFrame(() => {
          setContentHeight(contentEl.scrollHeight);
        });
      }
    } else {
      setContentHeight(0);
    }
  }, [expanded, children]);

  // Handle toggle
  const handleToggle = () => {
    if (disabled) return;

    const newIsOpen = !expanded;
    
    if (!isControlled) {
      setIsOpen(newIsOpen);
    }
    
    onToggle?.(newIsOpen);
  };

  // Container classes
  const containerClasses = `
    collapse
    overflow-hidden
    ${bordered ? 'border border-neutral-200 rounded-md' : ''}
    ${shadow ? 'shadow-sm' : ''}
    ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
    ${className}
  `;

  // Title classes
  const titleClasses = `
    collapse-title
    flex items-center justify-between
    py-3 px-4
    font-medium
    ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-neutral-50'}
    ${titleClassName}
  `;

  // Content classes
  const contentClasses = `
    collapse-content
    px-4 pb-4
    ${divider && expanded ? 'border-t border-neutral-200' : ''}
    ${contentClassName}
  `;

  return (
    <div className={containerClasses}>
      <div
        className={titleClasses}
        onClick={handleToggle}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={expanded}
        aria-disabled={disabled}
      >
        <div>{title}</div>
        <div className="flex items-center">
          {icon || (
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            />
          )}
        </div>
      </div>
      
      <div
        ref={contentRef}
        className={contentClasses}
        style={{
          height: contentHeight === undefined ? 'auto' : `${contentHeight}px`,
          overflow: contentHeight === undefined ? 'visible' : 'hidden',
          transition: 'height 200ms ease-out',
        }}
        aria-hidden={!expanded}
      >
        <div className="pt-3">{children}</div>
      </div>
    </div>
  );
}

// CollapseGroup component for managing multiple collapses
interface CollapseGroupProps {
  /**
   * The children of the collapse group
   */
  children: ReactNode;
  /**
   * Whether to allow multiple collapses to be open at once
   */
  accordion?: boolean;
  /**
   * The index of the default open collapse
   */
  defaultOpenIndex?: number;
  /**
   * Custom class name
   */
  className?: string;
}

export function CollapseGroup({
  children,
  accordion = true,
  defaultOpenIndex = -1,
  className = '',
}: CollapseGroupProps) {
  // State for tracking which collapses are open
  const [openIndices, setOpenIndices] = useState<number[]>(
    defaultOpenIndex >= 0 ? [defaultOpenIndex] : []
  );

  // Handle toggle for a specific collapse
  const handleToggle = (index: number, isOpen: boolean) => {
    if (isOpen) {
      if (accordion) {
        // In accordion mode, only one can be open at a time
        setOpenIndices([index]);
      } else {
        // In non-accordion mode, multiple can be open
        setOpenIndices([...openIndices, index]);
      }
    } else {
      // Close the collapse
      setOpenIndices(openIndices.filter(i => i !== index));
    }
  };

  // Clone children with additional props
  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        open: openIndices.includes(index),
        onToggle: (isOpen: boolean) => {
          handleToggle(index, isOpen);
          if (child.props.onToggle) {
            child.props.onToggle(isOpen);
          }
        },
        // Preserve other props from the original child
        ...child.props,
      });
    }
    return child;
  });

  return (
    <div className={`collapse-group ${className}`}>
      {enhancedChildren}
    </div>
  );
}