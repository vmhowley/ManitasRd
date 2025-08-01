import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  overlayClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  preventScroll?: boolean;
  closeButtonLabel?: string;
  id?: string;
}

export function Drawer({
  isOpen,
  onClose,
  children,
  position = 'right',
  size = 'md',
  closeOnClickOutside = true,
  closeOnEsc = true,
  showCloseButton = true,
  title,
  footer,
  className = '',
  contentClassName = '',
  overlayClassName = '',
  headerClassName = '',
  footerClassName = '',
  preventScroll = true,
  closeButtonLabel = 'Close drawer',
  id,
}: DrawerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  
  // Generate a unique ID if not provided
  const drawerId = id || `drawer-${Math.random().toString(36).substring(2, 9)}`;
  
  // Size classes based on position
  const sizeClasses = {
    left: {
      sm: 'w-64',
      md: 'w-80',
      lg: 'w-96',
      xl: 'w-1/3',
      full: 'w-screen',
    },
    right: {
      sm: 'w-64',
      md: 'w-80',
      lg: 'w-96',
      xl: 'w-1/3',
      full: 'w-screen',
    },
    top: {
      sm: 'h-1/4',
      md: 'h-1/3',
      lg: 'h-1/2',
      xl: 'h-2/3',
      full: 'h-screen',
    },
    bottom: {
      sm: 'h-1/4',
      md: 'h-1/3',
      lg: 'h-1/2',
      xl: 'h-2/3',
      full: 'h-screen',
    },
  };
  
  // Position classes
  const positionClasses = {
    left: 'inset-y-0 left-0',
    right: 'inset-y-0 right-0',
    top: 'inset-x-0 top-0',
    bottom: 'inset-x-0 bottom-0',
  };
  
  // Transform classes for animations
  const transformClasses = {
    left: 'translate-x-[-100%]',
    right: 'translate-x-[100%]',
    top: 'translate-y-[-100%]',
    bottom: 'translate-y-[100%]',
  };
  
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeOnEsc, isOpen, onClose]);
  
  // Handle body scroll locking
  useEffect(() => {
    if (preventScroll) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    
    return () => {
      if (preventScroll) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, preventScroll]);
  
  // Handle animation timing
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  // Handle click outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  if (!isVisible && !isOpen) {
    return null;
  }
  
  return (
    <div
      className={`
        fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center
        ${isOpen ? 'bg-neutral-900/50 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}
        transition-all duration-300 ease-in-out
        ${overlayClassName}
      `}
      onClick={handleOverlayClick}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? `${drawerId}-title` : undefined}
    >
      <div
        ref={drawerRef}
        className={`
          fixed dark:bg-neutral-900 dark:border-neutral-800 shadow-lg
          ${positionClasses[position]}
          ${isOpen ? 'transform-none' : transformClasses[position]}
          transition-transform duration-300 ease-in-out
          flex flex-col
          ${className}
        `}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className={`
              flex items-center justify-between
              px-4 py-3 border-b border-neutral-200
              ${headerClassName}
            `}
          >
            {title && (
              <h2
                id={`${drawerId}-title`}
                className="text-lg font-medium text-neutral-900"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label={closeButtonLabel}
                className="ml-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div
          className={`
            flex-1 overflow-auto p-4
            ${contentClassName}
          `}
        >
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div
            className={`
              px-4 py-3 border-t border-neutral-200
              ${footerClassName}
            `}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Drawer context for controlling drawer state
interface DrawerContextType {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}

const DrawerContext = React.createContext<DrawerContextType | undefined>(undefined);

// Drawer provider component
interface DrawerProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function DrawerProvider({
  children,
  defaultOpen = false,
}: DrawerProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);
  
  const value = { open, close, toggle, isOpen };
  
  return (
    <DrawerContext.Provider value={value}>
      {children}
    </DrawerContext.Provider>
  );
}

// Hook to use drawer context
export function useDrawer() {
  const context = React.useContext(DrawerContext);
  if (context === undefined) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
}

// Drawer trigger component
interface DrawerTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function DrawerTrigger({
  children,
  asChild = false,
}: DrawerTriggerProps) {
  const { open } = useDrawer();
  
  if (asChild) {
    return React.cloneElement(children as any, {
      onClick: (e: React.MouseEvent) => {
        (children as any).props.onClick?.(e);
        open();
      },
    });
  }
  
  return (
    <div onClick={open}>
      {children}
    </div>
  );
}

// Drawer content component
interface DrawerContentProps extends Omit<DrawerProps, 'isOpen' | 'onClose'> {}

export function DrawerContent(props: DrawerContentProps) {
  const { isOpen, close } = useDrawer();
  
  return <Drawer isOpen={isOpen} onClose={close} {...props} />;
}