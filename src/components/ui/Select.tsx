import { useState, useEffect, useRef, type KeyboardEvent, type ChangeEvent } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  className?: string;
  selectClassName?: string;
  id?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  clearable?: boolean;
  searchable?: boolean;
}

export function Select({
  options,
  value,
  defaultValue = '',
  onChange,
  onBlur,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  error,
  label,
  helperText,
  className = '',
  selectClassName = '',
  id,
  name,
  size = 'md',
  fullWidth = false,
  clearable = false,
  searchable = false,
}: SelectProps) {
  // Support both controlled and uncontrolled modes
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : selectedValue;
  const selectedOption = options.find(option => option.value === currentValue);

  // Generate a unique ID if not provided
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

  // Size classes
  const sizeClasses = {
    sm: {
      select: 'h-8 text-sm',
      option: 'py-1 px-2 text-sm',
      icon: 'h-3 w-3',
    },
    md: {
      select: 'h-10 text-base',
      option: 'py-2 px-3 text-base',
      icon: 'h-4 w-4',
    },
    lg: {
      select: 'h-12 text-lg',
      option: 'py-3 px-4 text-lg',
      icon: 'h-5 w-5',
    },
  };

  // Update internal state when controlled prop changes
  useEffect(() => {
    if (isControlled) {
      setSelectedValue(value);
    }
  }, [value, isControlled]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onBlur?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onBlur]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Scroll to highlighted option
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && optionsRef.current) {
      const highlightedElement = optionsRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, highlightedIndex]);

  // Handle value change
  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setSelectedValue(newValue);
    }
    onChange?.(newValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Handle clear button click
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isControlled) {
      setSelectedValue('');
    }
    onChange?.('');
    setSearchTerm('');
  };

  // Handle search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(0);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    const filteredOptions = options.filter(
      option => !option.disabled && option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (e.key) {
      case 'Enter':
        if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleChange(filteredOptions[highlightedIndex].value);
        } else {
          setIsOpen(prev => !prev);
        }
        e.preventDefault();
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
      case 'ArrowDown':
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        e.preventDefault();
        break;
      case 'ArrowUp':
        if (isOpen) {
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        }
        e.preventDefault();
        break;
      case ' ': // Space
        if (!searchable) {
          setIsOpen(prev => !prev);
          e.preventDefault();
        }
        break;
      default:
        break;
    }
  };

  // Filter options based on search term
  const filteredOptions = options.filter(
    option => !option.disabled && option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${fullWidth ? 'w-full' : 'w-auto'} ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
          className={`block text-sm font-medium mb-1 ${error ? 'text-error-500' : 'text-neutral-700'}`}
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      {/* Select container */}
      <div
        ref={selectRef}
        id={selectId}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${selectId}-options`}
        aria-labelledby={label ? `${selectId}-label` : undefined}
        aria-invalid={!!error}
        aria-required={required}
        aria-disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`
          relative flex items-center justify-between
          border rounded-md bg-white
          transition-colors duration-200
          ${error ? 'border-error-500' : 'border-neutral-300'}
          ${disabled ? 'bg-neutral-100 cursor-not-allowed opacity-75' : 'cursor-pointer hover:border-primary-400'}
          ${isOpen && !error ? 'border-primary-500 ring-1 ring-primary-500' : ''}
          ${sizeClasses[size].select}
          ${fullWidth ? 'w-full' : 'w-auto'}
          ${selectClassName}
        `}
      >
        {/* Selected value or placeholder */}
        <div className="flex-grow px-3 truncate">
          {selectedOption ? (
            <span className="block truncate">{selectedOption.label}</span>
          ) : (
            <span className="block truncate text-neutral-400">{placeholder}</span>
          )}
        </div>

        {/* Clear button */}
        {clearable && currentValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-neutral-400 hover:text-neutral-600 focus:outline-none"
            aria-label="Clear selection"
          >
            <X className={sizeClasses[size].icon} />
          </button>
        )}

        {/* Dropdown icon */}
        <div className="flex items-center pr-2 pointer-events-none">
          <ChevronDown
            className={`text-neutral-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''} ${sizeClasses[size].icon}`}
          />
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div
            className="
              absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-neutral-200
              max-h-60 overflow-auto focus:outline-none py-1
              left-0 top-full
            "
            role="listbox"
            id={`${selectId}-options`}
          >
            {/* Search input */}
            {searchable && (
              <div className="sticky top-0 bg-white p-2 border-b border-neutral-200">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search..."
                  className="
                    w-full px-3 py-1 text-sm
                    border border-neutral-300 rounded-md
                    focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                  "
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Options list */}
            <div ref={optionsRef}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    role="option"
                    aria-selected={currentValue === option.value}
                    onClick={() => handleChange(option.value)}
                    className={`
                      ${sizeClasses[size].option}
                      flex items-center justify-between
                      cursor-pointer
                      ${currentValue === option.value ? 'bg-primary-50 text-primary-700' : 'text-neutral-700'}
                      ${highlightedIndex === index ? 'bg-neutral-100' : ''}
                      ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-100'}
                    `}
                  >
                    <span className="block truncate">{option.label}</span>
                    {currentValue === option.value && (
                      <Check className={`${sizeClasses[size].icon} text-primary-600`} />
                    )}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-neutral-500 text-center">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error message or helper text */}
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-error-500' : 'text-neutral-500'}`}>
          {error || helperText}
        </p>
      )}

      {/* Hidden input for form submission */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={currentValue || ''}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

// Multi-select component
interface MultiSelectProps extends Omit<SelectProps, 'value' | 'defaultValue' | 'onChange'> {
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  maxItems?: number;
}

export function MultiSelect({
  options,
  value,
  defaultValue = [],
  onChange,
  maxItems,
  ...props
}: MultiSelectProps) {
  // Support both controlled and uncontrolled modes
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const currentValues = isControlled ? value : selectedValues;
  const selectedOptions = options.filter(option => currentValues.includes(option.value));

  // Generate a unique ID if not provided
  const selectId = props.id || `multi-select-${Math.random().toString(36).substring(2, 9)}`;

  // Size classes
  const sizeClasses = {
    sm: {
      select: 'min-h-8 text-sm',
      option: 'py-1 px-2 text-sm',
      tag: 'text-xs py-0.5 px-1.5',
      icon: 'h-3 w-3',
    },
    md: {
      select: 'min-h-10 text-base',
      option: 'py-2 px-3 text-base',
      tag: 'text-xs py-0.5 px-2',
      icon: 'h-4 w-4',
    },
    lg: {
      select: 'min-h-12 text-lg',
      option: 'py-3 px-4 text-lg',
      tag: 'text-sm py-1 px-2.5',
      icon: 'h-5 w-5',
    },
  };

  // Update internal state when controlled prop changes
  useEffect(() => {
    if (isControlled) {
      setSelectedValues(value);
    }
  }, [value, isControlled]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        props.onBlur?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [props.onBlur]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && props.searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, props.searchable]);

  // Scroll to highlighted option
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && optionsRef.current) {
      const highlightedElement = optionsRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, highlightedIndex]);

  // Handle value change
  const handleToggleOption = (optionValue: string) => {
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter(v => v !== optionValue)
      : [...currentValues, optionValue];

    if (maxItems && !currentValues.includes(optionValue) && currentValues.length >= maxItems) {
      return; // Don't add if max items reached
    }

    if (!isControlled) {
      setSelectedValues(newValues);
    }
    onChange?.(newValues);
    setSearchTerm('');
  };

  // Handle removing a selected option
  const handleRemoveOption = (e: React.MouseEvent, optionValue: string) => {
    e.stopPropagation();
    const newValues = currentValues.filter(v => v !== optionValue);
    if (!isControlled) {
      setSelectedValues(newValues);
    }
    onChange?.(newValues);
  };

  // Handle clear all button click
  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isControlled) {
      setSelectedValues([]);
    }
    onChange?.([]);
    setSearchTerm('');
  };

  // Handle search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(0);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (props.disabled) return;

    const filteredOptions = options.filter(
      option => !option.disabled && option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (e.key) {
      case 'Enter':
        if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleToggleOption(filteredOptions[highlightedIndex].value);
        } else {
          setIsOpen(prev => !prev);
        }
        e.preventDefault();
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
      case 'ArrowDown':
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        e.preventDefault();
        break;
      case 'ArrowUp':
        if (isOpen) {
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        }
        e.preventDefault();
        break;
      case ' ': // Space
        if (!props.searchable) {
          setIsOpen(prev => !prev);
          e.preventDefault();
        }
        break;
      default:
        break;
    }
  };

  // Filter options based on search term
  const filteredOptions = options.filter(
    option => !option.disabled && option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const size = props.size || 'md';

  return (
    <div className={`${props.fullWidth ? 'w-full' : 'w-auto'} ${props.className || ''}`}>
      {/* Label */}
      {props.label && (
        <label
          htmlFor={selectId}
          className={`block text-sm font-medium mb-1 ${props.error ? 'text-error-500' : 'text-neutral-700'}`}
        >
          {props.label}
          {props.required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      {/* Select container */}
      <div
        ref={selectRef}
        id={selectId}
        tabIndex={props.disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${selectId}-options`}
        aria-labelledby={props.label ? `${selectId}-label` : undefined}
        aria-invalid={!!props.error}
        aria-required={props.required}
        aria-disabled={props.disabled}
        onClick={() => !props.disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`
          relative flex flex-wrap items-center
          border rounded-md bg-white p-1.5
          transition-colors duration-200
          ${props.error ? 'border-error-500' : 'border-neutral-300'}
          ${props.disabled ? 'bg-neutral-100 cursor-not-allowed opacity-75' : 'cursor-pointer hover:border-primary-400'}
          ${isOpen && !props.error ? 'border-primary-500 ring-1 ring-primary-500' : ''}
          ${sizeClasses[size].select}
          ${props.fullWidth ? 'w-full' : 'w-auto'}
          ${props.selectClassName || ''}
        `}
      >
        {/* Selected tags */}
        <div className="flex flex-wrap gap-1.5 flex-grow">
          {selectedOptions.length > 0 ? (
            selectedOptions.map(option => (
              <div
                key={option.value}
                className={`
                  inline-flex items-center rounded-md
                  bg-primary-100 text-primary-800
                  ${sizeClasses[size].tag}
                `}
              >
                <span className="truncate max-w-[150px]">{option.label}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemoveOption(e, option.value)}
                  className="ml-1 text-primary-600 hover:text-primary-800 focus:outline-none"
                  aria-label={`Remove ${option.label}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))
          ) : (
            <span className="px-1.5 text-neutral-400">{props.placeholder || 'Select options'}</span>
          )}
        </div>

        {/* Clear all button */}
        {props.clearable && currentValues.length > 0 && !props.disabled && (
          <button
            type="button"
            onClick={handleClearAll}
            className="p-1 text-neutral-400 hover:text-neutral-600 focus:outline-none"
            aria-label="Clear all selections"
          >
            <X className={sizeClasses[size].icon} />
          </button>
        )}

        {/* Dropdown icon */}
        <div className="flex items-center pr-1 pointer-events-none">
          <ChevronDown
            className={`text-neutral-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''} ${sizeClasses[size].icon}`}
          />
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div
            className="
              absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-neutral-200
              max-h-60 overflow-auto focus:outline-none py-1
              left-0 top-full
            "
            role="listbox"
            id={`${selectId}-options`}
            aria-multiselectable="true"
          >
            {/* Search input */}
            {props.searchable && (
              <div className="sticky top-0 bg-white p-2 border-b border-neutral-200">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search..."
                  className="
                    w-full px-3 py-1 text-sm
                    border border-neutral-300 rounded-md
                    focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                  "
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Max items message */}
            {maxItems && currentValues.length >= maxItems && (
              <div className="px-3 py-2 text-xs text-warning-600 bg-warning-50 border-b border-warning-100">
                Maximum of {maxItems} items can be selected
              </div>
            )}

            {/* Options list */}
            <div ref={optionsRef}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const isSelected = currentValues.includes(option.value);
                  const isDisabled = option.disabled || (maxItems && currentValues.length >= maxItems && !isSelected);
                  
                  return (
                    <div
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => !isDisabled && handleToggleOption(option.value)}
                      className={`
                        ${sizeClasses[size].option}
                        flex items-center justify-between
                        ${isSelected ? 'bg-primary-50 text-primary-700' : 'text-neutral-700'}
                        ${highlightedIndex === index ? 'bg-neutral-100' : ''}
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-neutral-100'}
                      `}
                    >
                      <span className="block truncate">{option.label}</span>
                      {isSelected && (
                        <Check className={`${sizeClasses[size].icon} text-primary-600`} />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="px-3 py-2 text-sm text-neutral-500 text-center">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error message or helper text */}
      {(props.error || props.helperText) && (
        <p className={`mt-1 text-sm ${props.error ? 'text-error-500' : 'text-neutral-500'}`}>
          {props.error || props.helperText}
        </p>
      )}

      {/* Hidden input for form submission */}
      {props.name && (
        <input
          type="hidden"
          name={props.name}
          value={currentValues.join(',')}
          aria-hidden="true"
        />
      )}
    </div>
  );
}