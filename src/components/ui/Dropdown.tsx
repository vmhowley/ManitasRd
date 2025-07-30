import { type ReactNode, useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

type DropdownPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  position?: DropdownPosition;
  className?: string;
  menuClassName?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  closeOnClick?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  disabled?: boolean;
}

export function Dropdown({
  trigger,
  children,
  position = 'bottom-left',
  className = '',
  menuClassName = '',
  isOpen: controlledIsOpen,
  onOpenChange,
  closeOnClick = true,
  closeOnClickOutside = true,
  closeOnEsc = true,
  disabled = false,
}: DropdownProps) {
  // Support both controlled and uncontrolled modes
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleOpen = (open: boolean) => {
    if (!isControlled) {
      setUncontrolledIsOpen(open);
    }
    onOpenChange?.(open);
  };

  const toggle = () => {
    if (!disabled) {
      handleOpen(!isOpen);
    }
  };

  const close = () => {
    handleOpen(false);
  };

  // Handle click outside
  useEffect(() => {
    if (!isOpen || !closeOnClickOutside) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeOnClickOutside]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, closeOnEsc]);

  // Position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'top-full left-0 mt-1';
      case 'bottom-right':
        return 'top-full right-0 mt-1';
      case 'top-left':
        return 'bottom-full left-0 mb-1';
      case 'top-right':
        return 'bottom-full right-0 mb-1';
      default:
        return 'top-full left-0 mt-1';
    }
  };

  // Handle menu item click
  const handleMenuItemClick = () => {
    if (closeOnClick) {
      close();
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={toggle}
        className={`cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute z-50 min-w-[10rem] py-1 bg-white rounded-md shadow-lg border border-neutral-200 ${getPositionClasses()} ${menuClassName}`}
          onClick={handleMenuItemClick}
          role="menu"
          aria-orientation="vertical"
        >
          {children}
        </div>
      )}
    </div>
  );
}

// Dropdown Item component for consistent styling
interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  danger?: boolean;
}

export function DropdownItem({
  children,
  onClick,
  disabled = false,
  className = '',
  icon,
  danger = false,
}: DropdownItemProps) {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <button
      className={`w-full text-left px-4 py-2 text-sm ${danger ? 'text-error-600 hover:bg-error-50' : 'text-neutral-700 hover:bg-neutral-100'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} flex items-center ${className}`}
      onClick={handleClick}
      disabled={disabled}
      role="menuitem"
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}

// Dropdown Divider component
export function DropdownDivider({ className = '' }: { className?: string }) {
  return <div className={`my-1 border-t border-neutral-200 ${className}`} role="separator" />;
}

// Dropdown Label component
export function DropdownLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`px-4 py-1 text-xs font-semibold text-neutral-500 uppercase tracking-wider ${className}`}>
      {children}
    </div>
  );
}

// Button with dropdown
export function DropdownButton({
  label,
  children,
  variant = 'primary',
  size = 'md',
  position = 'bottom-left',
  className = '',
  menuClassName = '',
  disabled = false,
}: {
  label: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  position?: DropdownPosition;
  className?: string;
  menuClassName?: string;
  disabled?: boolean;
}) {
  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    // Size classes
    const sizeClasses = {
      sm: 'px-2.5 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
    
    // Variant classes
    const variantClasses = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
      outline: 'border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 focus:ring-primary-500',
      ghost: 'text-neutral-700 bg-transparent hover:bg-neutral-100 focus:ring-primary-500',
    };
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
  };

  return (
    <Dropdown
      trigger={
        <button className={`${getButtonClasses()} ${className}`} disabled={disabled}>
          {label}
          <ChevronDown className="ml-2 -mr-1 h-4 w-4" aria-hidden="true" />
        </button>
      }
      position={position}
      menuClassName={menuClassName}
      disabled={disabled}
    >
      {children}
    </Dropdown>
  );
}