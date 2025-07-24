import React, { useState, useRef, useEffect, createContext, useContext, ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

// Types
type MenuSize = 'sm' | 'md' | 'lg';
type MenuVariant = 'default' | 'bordered' | 'card';

// Context interface
interface MenuContextValue {
  activeItem: string | null;
  setActiveItem: (id: string | null) => void;
  size: MenuSize;
  variant: MenuVariant;
  collapsible: boolean;
  accordion: boolean;
}

// Create context
const MenuContext = createContext<MenuContextValue | null>(null);

// Hook to use menu context
function useMenuContext() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('Menu compound components must be used within a Menu component');
  }
  return context;
}

// Menu props
interface MenuProps {
  defaultActiveItem?: string;
  activeItem?: string;
  onItemChange?: (id: string | null) => void;
  size?: MenuSize;
  variant?: MenuVariant;
  collapsible?: boolean;
  accordion?: boolean;
  className?: string;
  children: ReactNode;
}

// Main Menu component
export function Menu({
  defaultActiveItem = null,
  activeItem,
  onItemChange,
  size = 'md',
  variant = 'default',
  collapsible = false,
  accordion = false,
  className = '',
  children,
}: MenuProps) {
  // State for controlled/uncontrolled usage
  const [internalActiveItem, setInternalActiveItem] = useState<string | null>(defaultActiveItem);
  const isControlled = activeItem !== undefined;
  const currentActiveItem = isControlled ? activeItem : internalActiveItem;

  // Handle item change
  const handleItemChange = (id: string | null) => {
    if (!isControlled) {
      setInternalActiveItem(id);
    }
    onItemChange?.(id);
  };

  // Context value
  const contextValue = {
    activeItem: currentActiveItem,
    setActiveItem: handleItemChange,
    size,
    variant,
    collapsible,
    accordion,
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-white',
    bordered: 'bg-white border border-neutral-200 rounded-md overflow-hidden',
    card: 'bg-white shadow-sm rounded-md overflow-hidden',
  };

  return (
    <MenuContext.Provider value={contextValue}>
      <div
        className={`menu w-full ${variantClasses[variant]} ${className}`}
        role="menu"
      >
        {children}
      </div>
    </MenuContext.Provider>
  );
}

// MenuItem props
interface MenuItemProps {
  id?: string;
  icon?: ReactNode;
  label: string;
  description?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

// MenuItem component
export function MenuItem({
  id,
  icon,
  label,
  description,
  disabled = false,
  onClick,
  className = '',
  children,
}: MenuItemProps) {
  const { activeItem, setActiveItem, size, variant, collapsible, accordion } = useMenuContext();
  const [isOpen, setIsOpen] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Generate a unique ID if not provided
  const itemId = id || `menu-item-${Math.random().toString(36).substring(2, 9)}`;
  const isActive = activeItem === itemId;
  const hasChildren = !!children;

  // Update content height when children change or when open/close state changes
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, children]);

  // Handle click
  const handleClick = () => {
    if (disabled) return;

    if (hasChildren && collapsible) {
      setIsOpen(!isOpen);
    }

    if (!hasChildren || !collapsible) {
      setActiveItem(isActive && !accordion ? null : itemId);
    }

    onClick?.();
  };

  // Size classes
  const sizeClasses = {
    sm: {
      item: 'py-1.5 px-2 text-sm',
      icon: 'w-4 h-4 mr-2',
      description: 'text-xs',
      chevron: 'w-4 h-4',
    },
    md: {
      item: 'py-2 px-3 text-base',
      icon: 'w-5 h-5 mr-2.5',
      description: 'text-sm',
      chevron: 'w-5 h-5',
    },
    lg: {
      item: 'py-2.5 px-4 text-lg',
      icon: 'w-6 h-6 mr-3',
      description: 'text-base',
      chevron: 'w-5 h-5',
    },
  };

  return (
    <div className="menu-item-wrapper" ref={itemRef}>
      <div
        className={`
          menu-item
          ${sizeClasses[size].item}
          ${isActive ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${hasChildren ? 'flex justify-between items-center' : ''}
          ${className}
        `}
        onClick={handleClick}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-expanded={hasChildren ? isOpen : undefined}
      >
        <div className="flex items-center">
          {icon && <span className={`menu-item-icon ${sizeClasses[size].icon}`}>{icon}</span>}
          <div>
            <div className="menu-item-label font-medium">{label}</div>
            {description && (
              <div className={`menu-item-description text-neutral-500 ${sizeClasses[size].description}`}>
                {description}
              </div>
            )}
          </div>
        </div>

        {hasChildren && collapsible && (
          <ChevronRight
            className={`menu-item-chevron transition-transform duration-200 ${sizeClasses[size].chevron} ${isOpen ? 'rotate-90' : ''}`}
          />
        )}
      </div>

      {hasChildren && collapsible && (
        <div
          className="menu-item-content overflow-hidden transition-all duration-200"
          style={{ height: `${contentHeight}px` }}
          ref={contentRef}
        >
          <div className="pl-4 border-l border-neutral-200 ml-4">{children}</div>
        </div>
      )}

      {hasChildren && !collapsible && isActive && (
        <div className="menu-item-content pl-4 border-l border-neutral-200 ml-4">{children}</div>
      )}
    </div>
  );
}

// MenuGroup props
interface MenuGroupProps {
  label: string;
  className?: string;
  children: ReactNode;
}

// MenuGroup component
export function MenuGroup({ label, className = '', children }: MenuGroupProps) {
  const { size } = useMenuContext();

  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-1.5 px-3',
    lg: 'text-base py-2 px-4',
  };

  return (
    <div className={`menu-group ${className}`}>
      <div className={`menu-group-label font-semibold text-neutral-500 uppercase tracking-wider ${sizeClasses[size]}`}>
        {label}
      </div>
      <div className="menu-group-content">{children}</div>
    </div>
  );
}

// MenuDivider component
export function MenuDivider() {
  return <div className="menu-divider h-px bg-neutral-200 my-1" />;
}

// Export all components
export { MenuContext, useMenuContext };