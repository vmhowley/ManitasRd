import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CalendarValue = Date | null;
type CalendarRange = { from: Date | null; to: Date | null };
type CalendarMode = 'single' | 'range' | 'multiple';
type CalendarSize = 'sm' | 'md' | 'lg';

interface CalendarProps {
  /**
   * The selected date or dates
   */
  value?: CalendarValue | CalendarRange | Date[];
  /**
   * Default value for uncontrolled usage
   */
  defaultValue?: CalendarValue | CalendarRange | Date[];
  /**
   * Callback when the value changes
   */
  onChange?: (value: CalendarValue | CalendarRange | Date[]) => void;
  /**
   * The selection mode
   */
  mode?: CalendarMode;
  /**
   * The minimum selectable date
   */
  minDate?: Date;
  /**
   * The maximum selectable date
   */
  maxDate?: Date;
  /**
   * Disabled dates that cannot be selected
   */
  disabledDates?: Date[];
  /**
   * Whether to show the month and year navigation
   */
  showNavigation?: boolean;
  /**
   * Whether to show the today button
   */
  showToday?: boolean;
  /**
   * The size of the calendar
   */
  size?: CalendarSize;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Custom class name for the day cells
   */
  dayClassName?: (date: Date) => string;
  /**
   * First day of the week (0 = Sunday, 1 = Monday, etc.)
   */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export function Calendar({
  value,
  defaultValue,
  onChange,
  mode = 'single',
  minDate,
  maxDate,
  disabledDates = [],
  showNavigation = true,
  showToday = true,
  size = 'md',
  className = '',
  dayClassName,
  firstDayOfWeek = 1, // Monday as default
}: CalendarProps) {
  // State for current month and year being displayed
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  // State for selected dates (controlled or uncontrolled)
  const [selectedDates, setSelectedDates] = useState<Date[]>(() => {
    if (defaultValue) {
      if (Array.isArray(defaultValue)) {
        return defaultValue;
      } else if (defaultValue instanceof Date) {
        return [defaultValue];
      } else if (defaultValue && typeof defaultValue === 'object' && 'from' in defaultValue) {
        const dates: Date[] = [];
        if (defaultValue.from) dates.push(defaultValue.from);
        if (defaultValue.to) dates.push(defaultValue.to);
        return dates;
      }
    }
    return [];
  });

  // Update internal state when controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        setSelectedDates(value);
      } else if (value instanceof Date) {
        setSelectedDates([value]);
      } else if (value && typeof value === 'object' && 'from' in value) {
        const dates: Date[] = [];
        if (value.from) dates.push(value.from);
        if (value.to) dates.push(value.to);
        setSelectedDates(dates);
      } else {
        setSelectedDates([]);
      }
    }
  }, [value]);

  // Initialize calendar to show the month of the selected date
  useEffect(() => {
    if (selectedDates.length > 0) {
      setCurrentMonth(selectedDates[0].getMonth());
      setCurrentYear(selectedDates[0].getFullYear());
    }
  }, []);

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for the first day of the month
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Navigate to previous month
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Navigate to next month
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Navigate to today
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  // Check if a date is selected
  const isDateSelected = (date: Date) => {
    return selectedDates.some(selectedDate => 
      selectedDate.getDate() === date.getDate() &&
      selectedDate.getMonth() === date.getMonth() &&
      selectedDate.getFullYear() === date.getFullYear()
    );
  };

  // Check if a date is in range (for range selection)
  const isDateInRange = (date: Date) => {
    if (mode !== 'range' || selectedDates.length !== 2) return false;
    
    const [start, end] = selectedDates.sort((a, b) => a.getTime() - b.getTime());
    return date.getTime() > start.getTime() && date.getTime() < end.getTime();
  };

  // Check if a date is the start of a range
  const isRangeStart = (date: Date) => {
    if (mode !== 'range' || selectedDates.length !== 2) return false;
    
    const [start] = selectedDates.sort((a, b) => a.getTime() - b.getTime());
    return date.getDate() === start.getDate() &&
           date.getMonth() === start.getMonth() &&
           date.getFullYear() === start.getFullYear();
  };

  // Check if a date is the end of a range
  const isRangeEnd = (date: Date) => {
    if (mode !== 'range' || selectedDates.length !== 2) return false;
    
    const [, end] = selectedDates.sort((a, b) => a.getTime() - b.getTime());
    return date.getDate() === end.getDate() &&
           date.getMonth() === end.getMonth() &&
           date.getFullYear() === end.getFullYear();
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Check if a date is disabled
  const isDateDisabled = (date: Date) => {
    // Check if date is in disabledDates
    const isDisabled = disabledDates.some(disabledDate => 
      disabledDate.getDate() === date.getDate() &&
      disabledDate.getMonth() === date.getMonth() &&
      disabledDate.getFullYear() === date.getFullYear()
    );

    // Check if date is before minDate
    const isBefore = minDate ? date < minDate : false;

    // Check if date is after maxDate
    const isAfter = maxDate ? date > maxDate : false;

    return isDisabled || isBefore || isAfter;
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return;

    let newSelectedDates: Date[] = [];

    if (mode === 'single') {
      newSelectedDates = [date];
    } else if (mode === 'multiple') {
      // Toggle the date in the array
      if (isDateSelected(date)) {
        newSelectedDates = selectedDates.filter(selectedDate => 
          !(selectedDate.getDate() === date.getDate() &&
            selectedDate.getMonth() === date.getMonth() &&
            selectedDate.getFullYear() === date.getFullYear())
        );
      } else {
        newSelectedDates = [...selectedDates, date];
      }
    } else if (mode === 'range') {
      if (selectedDates.length === 0 || selectedDates.length === 2) {
        // Start a new range
        newSelectedDates = [date];
      } else {
        // Complete the range
        newSelectedDates = [...selectedDates, date].sort((a, b) => a.getTime() - b.getTime());
      }
    }

    // Update internal state for uncontrolled usage
    if (value === undefined) {
      setSelectedDates(newSelectedDates);
    }

    // Call onChange with the appropriate format based on mode
    if (onChange) {
      if (mode === 'single') {
        onChange(newSelectedDates[0] || null);
      } else if (mode === 'range') {
        onChange({
          from: newSelectedDates[0] || null,
          to: newSelectedDates[1] || null,
        });
      } else {
        onChange(newSelectedDates);
      }
    }
  };

  // Render the calendar grid
  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Adjust the first day based on firstDayOfWeek
    const adjustedFirstDay = (firstDayOfMonth - firstDayOfWeek + 7) % 7;

    // Add days from previous month
    const prevMonthDays = currentMonth === 0 
      ? getDaysInMonth(11, currentYear - 1) 
      : getDaysInMonth(currentMonth - 1, currentYear);
    
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(currentYear, currentMonth - 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isDisabled: isDateDisabled(date),
      });
    }

    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push({
        date,
        day,
        isCurrentMonth: true,
        isDisabled: isDateDisabled(date),
      });
    }

    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(currentYear, currentMonth + 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isDisabled: isDateDisabled(date),
      });
    }

    return days;
  };

  // Get weekday names based on firstDayOfWeek
  const getWeekdayNames = () => {
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const reorderedWeekdays = [
      ...weekdays.slice(firstDayOfWeek),
      ...weekdays.slice(0, firstDayOfWeek),
    ];
    return reorderedWeekdays;
  };

  // Size classes
  const sizeClasses = {
    sm: {
      calendar: 'text-xs',
      header: 'text-sm py-2',
      day: 'h-6 w-6',
      weekday: 'h-6 w-6',
    },
    md: {
      calendar: 'text-sm',
      header: 'text-base py-2',
      day: 'h-8 w-8',
      weekday: 'h-8 w-8',
    },
    lg: {
      calendar: 'text-base',
      header: 'text-lg py-3',
      day: 'h-10 w-10',
      weekday: 'h-10 w-10',
    },
  };

  return (
    <div className={`calendar ${sizeClasses[size].calendar} ${className}`}>
      {/* Calendar header */}
      {showNavigation && (
        <div className="calendar-header flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 rounded-full hover:bg-neutral-100"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <h2 className={`font-semibold ${sizeClasses[size].header}`}>
            {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          
          <button
            type="button"
            onClick={nextMonth}
            className="p-1 rounded-full hover:bg-neutral-100"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Weekday headers */}
      <div className="calendar-weekdays grid grid-cols-7 mb-1">
        {getWeekdayNames().map((weekday, index) => (
          <div
            key={`weekday-${index}`}
            className={`weekday flex items-center justify-center font-medium text-neutral-500 ${sizeClasses[size].weekday}`}
          >
            {weekday}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="calendar-grid grid grid-cols-7 gap-1">
        {renderCalendarGrid().map((day, index) => {
          const isSelected = isDateSelected(day.date);
          const inRange = isDateInRange(day.date);
          const isStart = isRangeStart(day.date);
          const isEnd = isRangeEnd(day.date);
          const isTodayDate = isToday(day.date);
          
          // Determine day classes
          let dayClasses = `
            day flex items-center justify-center rounded-full
            ${sizeClasses[size].day}
            ${!day.isCurrentMonth ? 'text-neutral-300' : ''}
            ${day.isDisabled ? 'text-neutral-300 cursor-not-allowed' : 'cursor-pointer hover:bg-neutral-100'}
            ${isTodayDate && !isSelected ? 'border border-primary-500 text-primary-700' : ''}
            ${isSelected ? 'bg-primary-500 text-white hover:bg-primary-600' : ''}
            ${inRange ? 'bg-primary-100 text-primary-700' : ''}
            ${isStart ? 'rounded-l-full' : ''}
            ${isEnd ? 'rounded-r-full' : ''}
          `;
          
          // Add custom day class if provided
          if (dayClassName && day.isCurrentMonth && !day.isDisabled) {
            dayClasses += ` ${dayClassName(day.date)}`;
          }
          
          return (
            <div
              key={`day-${index}`}
              className={dayClasses}
              onClick={() => !day.isDisabled && handleDateSelect(day.date)}
              role="button"
              tabIndex={day.isDisabled ? -1 : 0}
              aria-disabled={day.isDisabled}
              aria-selected={isSelected}
            >
              {day.day}
            </div>
          );
        })}
      </div>

      {/* Today button */}
      {showToday && (
        <div className="calendar-footer mt-4 text-center">
          <button
            type="button"
            onClick={goToToday}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Today
          </button>
        </div>
      )}
    </div>
  );
}