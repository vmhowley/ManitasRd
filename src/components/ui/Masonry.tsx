import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface MasonryProps {
  /**
   * The children to display in the masonry layout
   */
  children: ReactNode;
  /**
   * The number of columns
   */
  columns?: number;
  /**
   * The gap between items (in pixels)
   */
  gap?: number;
  /**
   * Whether to use a responsive layout
   */
  responsive?: boolean;
  /**
   * The number of columns at different breakpoints (responsive mode)
   */
  breakpoints?: {
    sm?: number; // Small devices (640px and up)
    md?: number; // Medium devices (768px and up)
    lg?: number; // Large devices (1024px and up)
    xl?: number; // Extra large devices (1280px and up)
    '2xl'?: number; // 2X large devices (1536px and up)
  };
  /**
   * Custom class name for the container
   */
  className?: string;
}

export function Masonry({
  children,
  columns = 3,
  gap = 16,
  responsive = true,
  breakpoints = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    '2xl': 5,
  },
  className = '',
}: MasonryProps) {
  // State for current column count (for responsive mode)
  const [columnCount, setColumnCount] = useState(columns);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update column count based on window width (for responsive mode)
  useEffect(() => {
    if (!responsive) {
      setColumnCount(columns);
      return;
    }

    const updateColumnCount = () => {
      const width = window.innerWidth;

      if (width >= 1536 && breakpoints['2xl']) {
        setColumnCount(breakpoints['2xl']);
      } else if (width >= 1280 && breakpoints.xl) {
        setColumnCount(breakpoints.xl);
      } else if (width >= 1024 && breakpoints.lg) {
        setColumnCount(breakpoints.lg);
      } else if (width >= 768 && breakpoints.md) {
        setColumnCount(breakpoints.md);
      } else if (width >= 640 && breakpoints.sm) {
        setColumnCount(breakpoints.sm);
      } else {
        setColumnCount(1); // Default for mobile
      }
    };

    // Initial update
    updateColumnCount();

    // Add resize listener
    window.addEventListener('resize', updateColumnCount);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateColumnCount);
    };
  }, [responsive, columns, breakpoints]);

  // Distribute children into columns
  const distributeChildren = () => {
    const childrenArray = React.Children.toArray(children);
    const columnItems: ReactNode[][] = Array.from({ length: columnCount }, () => []);

    // Distribute items to columns (one by one to each column)
    childrenArray.forEach((child, index) => {
      const columnIndex = index % columnCount;
      columnItems[columnIndex].push(child);
    });

    return columnItems;
  };

  // Container classes
  const containerClasses = `
    masonry
    flex
    w-full
    ${className}
  `;

  // Column classes
  const columnClasses = `
    masonry-column
    flex
    flex-col
  `;

  // Distribute children into columns
  const columnItems = distributeChildren();

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={{ gap: `${gap}px` }}
    >
      {columnItems.map((items, columnIndex) => (
        <div
          key={columnIndex}
          className={columnClasses}
          style={{
            flex: `1 1 ${100 / columnCount}%`,
            maxWidth: `${100 / columnCount}%`,
            gap: `${gap}px`,
          }}
        >
          {items.map((item, itemIndex) => (
            <div key={itemIndex} className="masonry-item">
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

interface MasonryItemProps {
  /**
   * The content of the masonry item
   */
  children: ReactNode;
  /**
   * Custom class name
   */
  className?: string;
}

export function MasonryItem({ children, className = '' }: MasonryItemProps) {
  // Item classes
  const itemClasses = `
    masonry-item
    w-full
    overflow-hidden
    ${className}
  `;

  return <div className={itemClasses}>{children}</div>;
}