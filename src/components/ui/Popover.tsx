import React, { useState, useEffect, useRef, type ReactNode, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// Types
type PopoverPlacement = 'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end';

// Context interface
interface PopoverContextValue {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  placement: PopoverPlacement;
  offset: number;
  closeOnClickOutside: boolean;
  closeOnEsc: boolean;
  id: string;
}

// Create context
const PopoverContext = createContext<PopoverContextValue | null>(null);

// Hook to use popover context
function usePopoverContext() {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('Popover compound components must be used within a Popover component');
  }
  return context;
}

// Popover props
interface PopoverProps {
  placement?: PopoverPlacement;
  offset?: number;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  children: ReactNode;
  id?: string;
}

// Main Popover component
export function Popover({
  placement = 'bottom',
  offset = 8,
  defaultOpen = false,
  open,
  onOpenChange,
  closeOnClickOutside = true,
  closeOnEsc = true,
  children,
  id: providedId,
}: PopoverProps) {
  // State for controlled/uncontrolled usage
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  // Refs for positioning
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Generate a unique ID if not provided
  const id = providedId || `popover-${Math.random().toString(36).substring(2, 9)}`;

  // Handle state changes
  const setIsOpen = (newIsOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newIsOpen);
    }
    onOpenChange?.(newIsOpen);
  };

  // Context value
  const contextValue = {
    isOpen,
    setIsOpen,
    triggerRef,
    contentRef,
    placement,
    offset,
    closeOnClickOutside,
    closeOnEsc,
    id,
  };

  return (
    <PopoverContext.Provider value={contextValue}>
      {children}
    </PopoverContext.Provider>
  );
}

// PopoverTrigger props
interface PopoverTriggerProps {
  children: React.ReactElement;
  asChild?: boolean;
}

// PopoverTrigger component
export function PopoverTrigger({ children, asChild = false }: PopoverTriggerProps) {
  const { isOpen, setIsOpen, triggerRef, id } = usePopoverContext();

  // Clone the child element to add necessary props
  const trigger = React.cloneElement(children as any, {
    ref: (node: HTMLElement) => {
      // Handle both function and object refs
      const childRef = (children as any).ref;
      if (typeof childRef === 'function') {
        childRef(node);
      } else if (childRef) {
        (childRef as React.MutableRefObject<HTMLElement>).current = node;
      }
      triggerRef.current = node;
    },
    'aria-expanded': isOpen,
    'aria-haspopup': 'dialog',
    'aria-controls': isOpen ? `${id}-content` : undefined,
    onClick: (e: React.MouseEvent) => {
      (children.props as any).onClick?.(e);
      setIsOpen(!isOpen);
    },
  });

  return asChild ? trigger : <span>{trigger}</span>;
}

// PopoverContent props
interface PopoverContentProps {
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeOnClickInside?: boolean;
  width?: number | string;
  maxHeight?: number | string;
  withArrow?: boolean;
  arrowClassName?: string;
}

// PopoverContent component
export function PopoverContent({
  children,
  className = '',
  showCloseButton = true,
  closeOnClickInside = false,
  width = 'auto',
  maxHeight,
  withArrow = true,
  arrowClassName = '',
}: PopoverContentProps) {
  const {
    isOpen,
    setIsOpen,
    triggerRef,
    contentRef,
    placement,
    offset,
    closeOnClickOutside,
    closeOnEsc,
    id,
  } = usePopoverContext();

  // State for portal mounting
  const [mounted, setMounted] = useState(false);

  // Position state
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 });

  // Calculate position
  const updatePosition = () => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;
    let arrowTop = 0;
    let arrowLeft = 0;

    // Base positioning based on placement
    switch (placement) {
      case 'top':
        top = triggerRect.top - contentRect.height - offset;
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
        arrowTop = contentRect.height;
        arrowLeft = contentRect.width / 2 - 8; // 8px is half the arrow width
        break;
      case 'top-start':
        top = triggerRect.top - contentRect.height - offset;
        left = triggerRect.left;
        arrowTop = contentRect.height;
        arrowLeft = Math.min(triggerRect.width / 2, 20);
        break;
      case 'top-end':
        top = triggerRect.top - contentRect.height - offset;
        left = triggerRect.right - contentRect.width;
        arrowTop = contentRect.height;
        arrowLeft = contentRect.width - Math.min(triggerRect.width / 2, 20);
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
        left = triggerRect.right + offset;
        arrowTop = contentRect.height / 2 - 8;
        arrowLeft = -8;
        break;
      case 'right-start':
        top = triggerRect.top;
        left = triggerRect.right + offset;
        arrowTop = Math.min(triggerRect.height / 2, 20);
        arrowLeft = -8;
        break;
      case 'right-end':
        top = triggerRect.bottom - contentRect.height;
        left = triggerRect.right + offset;
        arrowTop = contentRect.height - Math.min(triggerRect.height / 2, 20);
        arrowLeft = -8;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
        arrowTop = -8;
        arrowLeft = contentRect.width / 2 - 8;
        break;
      case 'bottom-start':
        top = triggerRect.bottom + offset;
        left = triggerRect.left;
        arrowTop = -8;
        arrowLeft = Math.min(triggerRect.width / 2, 20);
        break;
      case 'bottom-end':
        top = triggerRect.bottom + offset;
        left = triggerRect.right - contentRect.width;
        arrowTop = -8;
        arrowLeft = contentRect.width - Math.min(triggerRect.width / 2, 20);
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
        left = triggerRect.left - contentRect.width - offset;
        arrowTop = contentRect.height / 2 - 8;
        arrowLeft = contentRect.width;
        break;
      case 'left-start':
        top = triggerRect.top;
        left = triggerRect.left - contentRect.width - offset;
        arrowTop = Math.min(triggerRect.height / 2, 20);
        arrowLeft = contentRect.width;
        break;
      case 'left-end':
        top = triggerRect.bottom - contentRect.height;
        left = triggerRect.left - contentRect.width - offset;
        arrowTop = contentRect.height - Math.min(triggerRect.height / 2, 20);
        arrowLeft = contentRect.width;
        break;
    }

    // Adjust for viewport boundaries
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Prevent going off the right edge
    if (left + contentRect.width > viewportWidth - 10) {
      left = viewportWidth - contentRect.width - 10;
    }

    // Prevent going off the left edge
    if (left < 10) {
      left = 10;
    }

    // Prevent going off the bottom edge
    if (top + contentRect.height > viewportHeight - 10) {
      top = viewportHeight - contentRect.height - 10;
    }

    // Prevent going off the top edge
    if (top < 10) {
      top = 10;
    }

    setPosition({ top, left });
    setArrowPosition({ top: arrowTop, left: arrowLeft });
  };

  // Handle click outside
  useEffect(() => {
    if (!isOpen || !closeOnClickOutside) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeOnClickOutside, setIsOpen]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, closeOnEsc, setIsOpen]);

  // Update position when content changes
  useEffect(() => {
    if (!isOpen) return;

    updatePosition();
    const handleResize = () => updatePosition();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isOpen, children]);

  // Mount the portal on client side only
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Don't render if not open or not mounted
  if (!isOpen || !mounted) return null;

  // Arrow direction based on placement
  const arrowDirection = placement.startsWith('top')
    ? 'down'
    : placement.startsWith('right')
    ? 'left'
    : placement.startsWith('bottom')
    ? 'up'
    : 'right';

  // Arrow styles
  const getArrowStyles = () => {
    const baseStyles = 'absolute w-4 h-4 rotate-45';
    const positionStyles = `top-[${arrowPosition.top}px] left-[${arrowPosition.left}px]`;
    const colorStyles = 'bg-white border';

    const borderStyles = {
      up: 'border-t border-l border-neutral-200',
      down: 'border-b border-r border-neutral-200',
      left: 'border-l border-b border-neutral-200',
      right: 'border-r border-t border-neutral-200',
    };

    return `${baseStyles} ${positionStyles} ${colorStyles} ${borderStyles[arrowDirection]} ${arrowClassName}`;
  };

  return createPortal(
    <div
      ref={contentRef}
      id={`${id}-content`}
      role="dialog"
      aria-modal="true"
      className={`
        fixed z-50 bg-white rounded-md shadow-lg border border-neutral-200
        animate-in fade-in zoom-in-95 duration-150
        ${className}
      `}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: typeof width === 'number' ? `${width}px` : width,
        maxHeight: maxHeight ? (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight) : undefined,
        overflowY: maxHeight ? 'auto' : undefined,
      }}
      onClick={closeOnClickInside ? () => setIsOpen(false) : undefined}
    >
      {/* Content */}
      <div className="p-4">{children}</div>

      {/* Close button */}
      {showCloseButton && (
        <button
          type="button"
          className="absolute top-2 right-2 p-1 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
          onClick={() => setIsOpen(false)}
          aria-label="Close"
        >
          <X size={16} />
        </button>
      )}

      {/* Arrow */}
      {withArrow && <div className={getArrowStyles()} />}
    </div>,
    document.body
  );
}

// Export all components
export { PopoverContext, usePopoverContext };