import React, { createContext, useContext, useState } from 'react';

type TabsContextValue = {
  selectedTab: string;
  setSelectedTab: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a Tabs component');
  }
  return context;
}

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className = '',
}: TabsProps) {
  const [selectedTab, setSelectedTab] = useState(value || defaultValue || '');

  const handleTabChange = (value: string) => {
    if (!onValueChange) {
      setSelectedTab(value);
    } else {
      onValueChange(value);
    }
  };

  const contextValue = {
    selectedTab: value !== undefined ? value : selectedTab,
    setSelectedTab: handleTabChange,
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
}

export function TabsList({
  children,
  className = '',
  variant = 'default',
  fullWidth = false,
}: TabsListProps) {
  const variantStyles = {
    default: 'border-b border-neutral-200 dark:border-neutral-700',
    pills: '',
    underline: 'border-b border-neutral-200 dark:border-neutral-700',
  };

  return (
    <div className={`flex ${fullWidth ? 'w-full' : ''} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
}

export function TabsTrigger({
  value,
  children,
  className = '',
  disabled = false,
  icon,
  variant = 'default',
  fullWidth = false,
}: TabsTriggerProps) {
  const { selectedTab, setSelectedTab } = useTabs();
  const isActive = selectedTab === value;

  const baseTabStyles = 'flex items-center py-2 px-4 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-900';
  
  const variantStyles = {
    default: (isActive: boolean, isDisabled: boolean) => `
      ${isActive ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-500' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600 border-b-2 border-transparent'}
      ${isDisabled ? 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed' : ''}
    `,
    pills: (isActive: boolean, isDisabled: boolean) => `
      rounded-full
      ${isActive ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'}
      ${isDisabled ? 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed' : ''}
    `,
    underline: (isActive: boolean, isDisabled: boolean) => `
      ${isActive ? 'text-primary-600 dark:text-primary-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary-600 dark:after:bg-primary-500' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'}
      ${isDisabled ? 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed' : ''}
      relative
    `,
  };

  return (
    <button
      className={`
        ${baseTabStyles}
        ${variantStyles[variant](isActive, disabled)}
        ${fullWidth ? 'flex-1 justify-center' : ''}
        ${className}
      `}
      onClick={() => !disabled && setSelectedTab(value)}
      disabled={disabled}
      aria-selected={isActive}
      role="tab"
      tabIndex={isActive ? 0 : -1}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className = '' }: TabsContentProps) {
  const { selectedTab } = useTabs();
  const isActive = selectedTab === value;

  if (!isActive) return null;

  return (
    <div className={className} role="tabpanel">
      {children}
    </div>
  );
}