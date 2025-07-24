import React, { useState, useRef, useEffect, ReactNode, createContext, useContext } from 'react';
import { ChevronDown, Check, X, Search } from 'lucide-react';

// Context for Combobox
interface ComboboxContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string | string[];
  setValue: (value: string | string[]) => void;
  multiple: boolean;
  disabled: boolean;
  onSelect?: (value: string) => void;
  onRemove?: (value: string) => void;
  onClear?: () => void;
}

const ComboboxContext = createContext<ComboboxContextType | undefined>(undefined);

export function useComboboxContext() {
  const context = useContext(ComboboxContext);
  if (!context) {
    throw new Error('useComboboxContext must be used within a Combobox component');
  }
  return context;
}

interface ComboboxProps {
  /**
   * The selected value(s) (controlled)
   */
  value?: string | string[];
  /**
   * The default selected value(s) (uncontrolled)
   */
  defaultValue?: string | string[];
  /**
   * Callback when value changes
   */
  onChange?: (value: string | string[]) => void;
  /**
   * Callback when an option is selected
   */
  onSelect?: (value: string) => void;
  /**
   * Callback when an option is removed (multiple mode)
   */
  onRemove?: (value: string) => void;
  /**
   * Callback when all values are cleared
   */
  onClear?: () => void;
  /**
   * Whether the combobox allows multiple selections
   */
  multiple?: boolean;
  /**
   * Whether the combobox is disabled
   */
  disabled?: boolean;
  /**
   * Placeholder text for the input
   */
  placeholder?: string;
  /**
   * Children components
   */
  children: ReactNode;
  /**
   * Custom class name for the container
   */
  className?: string;
}

export function Combobox({
  value,
  defaultValue = '',
  onChange,
  onSelect,
  onRemove,
  onClear,
  multiple = false,
  disabled = false,
  placeholder = 'Select an option',
  children,
  className = '',
}: ComboboxProps) {
  // State for controlled/uncontrolled usage
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | string[]>(defaultValue);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Determine if component is controlled or uncontrolled
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  
  // Handle value change
  const handleValueChange = (newValue: string | string[]) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Context value
  const contextValue: ComboboxContextType = {
    open,
    setOpen,
    value: currentValue,
    setValue: handleValueChange,
    multiple,
    disabled,
    onSelect,
    onRemove,
    onClear,
  };
  
  // Container classes
  const containerClasses = `
    combobox
    relative
    w-full
    ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
    ${className}
  `;
  
  return (
    <ComboboxContext.Provider value={contextValue}>
      <div ref={containerRef} className={containerClasses}>
        {children}
      </div>
    </ComboboxContext.Provider>
  );
}

interface ComboboxTriggerProps {
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Children components (usually ComboboxValue)
   */
  children?: ReactNode;
}

export function ComboboxTrigger({ className = '', children }: ComboboxTriggerProps) {
  const { open, setOpen, disabled } = useComboboxContext();
  
  const handleClick = () => {
    if (disabled) return;
    setOpen(!open);
  };
  
  // Trigger classes
  const triggerClasses = `
    combobox-trigger
    flex
    items-center
    justify-between
    w-full
    px-3
    py-2
    border
    border-gray-300
    rounded-md
    bg-white
    text-sm
    ${open ? 'border-blue-500 ring-1 ring-blue-500' : ''}
    ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
    ${className}
  `;
  
  return (
    <div
      className={triggerClasses}
      onClick={handleClick}
      role="combobox"
      aria-expanded={open}
      aria-disabled={disabled}
    >
      {children}
      <ChevronDown
        className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
      />
    </div>
  );
}

interface ComboboxValueProps {
  /**
   * Placeholder text when no value is selected
   */
  placeholder?: string;
  /**
   * Whether to show a clear button
   */
  showClear?: boolean;
  /**
   * Custom class name
   */
  className?: string;
}

export function ComboboxValue({
  placeholder = 'Select an option',
  showClear = true,
  className = '',
}: ComboboxValueProps) {
  const { value, setValue, multiple, disabled, onRemove, onClear } = useComboboxContext();
  
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    
    setValue(multiple ? [] : '');
    onClear?.();
  };
  
  const handleRemoveTag = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    
    const newValue = Array.isArray(value) ? value.filter(v => v !== tag) : '';
    setValue(newValue);
    onRemove?.(tag);
  };
  
  // Value classes
  const valueClasses = `
    combobox-value
    flex-1
    flex
    flex-wrap
    items-center
    gap-1
    ${className}
  `;
  
  // Render selected values
  const renderValue = () => {
    if (multiple && Array.isArray(value) && value.length > 0) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((tag) => (
            <div
              key={tag}
              className="
                bg-blue-100
                text-blue-800
                text-xs
                px-2
                py-1
                rounded
                flex
                items-center
                gap-1
              "
            >
              <span>{tag}</span>
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={(e) => handleRemoveTag(tag, e)}
              />
            </div>
          ))}
        </div>
      );
    }
    
    if (!multiple && value && typeof value === 'string') {
      return <span>{value}</span>;
    }
    
    return <span className="text-gray-400">{placeholder}</span>;
  };
  
  const hasValue = multiple
    ? Array.isArray(value) && value.length > 0
    : !!value && typeof value === 'string';
  
  return (
    <div className={valueClasses}>
      {renderValue()}
      {showClear && hasValue && !disabled && (
        <X
          className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer"
          onClick={handleClear}
        />
      )}
    </div>
  );
}

interface ComboboxInputProps {
  /**
   * Placeholder text for the input
   */
  placeholder?: string;
  /**
   * Callback when input value changes
   */
  onInputChange?: (value: string) => void;
  /**
   * Custom class name
   */
  className?: string;
}

export function ComboboxInput({
  placeholder = 'Search...',
  onInputChange,
  className = '',
}: ComboboxInputProps) {
  const { open, setOpen, disabled } = useComboboxContext();
  const [inputValue, setInputValue] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onInputChange?.(newValue);
    
    if (!open) {
      setOpen(true);
    }
  };
  
  // Input classes
  const inputClasses = `
    combobox-input
    w-full
    px-3
    py-2
    border
    border-gray-300
    rounded-md
    bg-white
    text-sm
    focus:outline-none
    focus:ring-1
    focus:ring-blue-500
    focus:border-blue-500
    ${disabled ? 'cursor-not-allowed' : ''}
    ${className}
  `;
  
  return (
    <div className="relative">
      <input
        type="text"
        className={inputClasses}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
      />
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    </div>
  );
}

interface ComboboxContentProps {
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Children components (usually ComboboxItem)
   */
  children: ReactNode;
}

export function ComboboxContent({ className = '', children }: ComboboxContentProps) {
  const { open } = useComboboxContext();
  
  if (!open) return null;
  
  // Content classes
  const contentClasses = `
    combobox-content
    absolute
    z-10
    mt-1
    w-full
    max-h-60
    overflow-auto
    bg-white
    border
    border-gray-300
    rounded-md
    shadow-lg
    py-1
    ${className}
  `;
  
  return (
    <div className={contentClasses} role="listbox">
      {children}
    </div>
  );
}

interface ComboboxItemProps {
  /**
   * The value of the item
   */
  value: string;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Children components
   */
  children: ReactNode;
}

export function ComboboxItem({ value, className = '', children }: ComboboxItemProps) {
  const { value: selectedValue, setValue, multiple, setOpen, onSelect } = useComboboxContext();
  
  // Check if item is selected
  const isSelected = multiple
    ? Array.isArray(selectedValue) && selectedValue.includes(value)
    : selectedValue === value;
  
  const handleSelect = () => {
    if (multiple) {
      const currentValues = Array.isArray(selectedValue) ? selectedValue : [];
      const newValue = isSelected
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      setValue(newValue);
    } else {
      setValue(value);
      setOpen(false);
    }
    
    onSelect?.(value);
  };
  
  // Item classes
  const itemClasses = `
    combobox-item
    px-3
    py-2
    text-sm
    cursor-pointer
    flex
    items-center
    justify-between
    ${isSelected ? 'bg-blue-50 text-blue-800' : 'hover:bg-gray-100'}
    ${className}
  `;
  
  return (
    <div
      className={itemClasses}
      onClick={handleSelect}
      role="option"
      aria-selected={isSelected}
    >
      <div>{children}</div>
      {isSelected && <Check className="h-4 w-4" />}
    </div>
  );
}

interface ComboboxEmptyProps {
  /**
   * Text to display when no items match
   */
  text?: string;
  /**
   * Custom class name
   */
  className?: string;
}

export function ComboboxEmpty({
  text = 'No results found',
  className = '',
}: ComboboxEmptyProps) {
  // Empty classes
  const emptyClasses = `
    combobox-empty
    px-3
    py-2
    text-sm
    text-gray-500
    text-center
    ${className}
  `;
  
  return <div className={emptyClasses}>{text}</div>;
}