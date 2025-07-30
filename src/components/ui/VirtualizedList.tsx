import React, { useState, useEffect, useRef, type ReactNode, type CSSProperties } from 'react';

interface VirtualizedListProps<T> {
  /**
   * The data array to render
   */
  data: T[];
  /**
   * Function to render each item
   */
  renderItem: (item: T, index: number) => ReactNode;
  /**
   * Height of each item in pixels
   */
  itemHeight: number;
  /**
   * Height of the container in pixels
   */
  height: number;
  /**
   * Width of the container
   */
  width?: string | number;
  /**
   * Number of items to render above/below the visible area
   */
  overscan?: number;
  /**
   * Custom class name for the container
   */
  className?: string;
  /**
   * Custom class name for the inner container
   */
  innerClassName?: string;
  /**
   * Custom class name for each item
   */
  itemClassName?: string;
  /**
   * Callback when the visible range changes
   */
  onVisibleRangeChange?: (startIndex: number, endIndex: number) => void;
}

export function VirtualizedList<T>({ 
  data, 
  renderItem, 
  itemHeight, 
  height, 
  width = '100%', 
  overscan = 3, 
  className = '', 
  innerClassName = '',
  itemClassName = '',
  onVisibleRangeChange,
}: VirtualizedListProps<T>) {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State
  const [scrollTop, setScrollTop] = useState(0);
  const [visibleRange, setVisibleRange] = useState({ startIndex: 0, endIndex: 0 });
  
  // Calculate the total height of all items
  const totalHeight = data.length * itemHeight;
  
  // Calculate the range of visible items
  useEffect(() => {
    if (!containerRef.current) return;
    
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      data.length - 1,
      Math.ceil((scrollTop + height) / itemHeight) + overscan
    );
    
    setVisibleRange({ startIndex, endIndex });
    onVisibleRangeChange?.(startIndex, endIndex);
  }, [scrollTop, height, itemHeight, data.length, overscan, onVisibleRangeChange]);
  
  // Handle scroll
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  };
  
  // Get items to render
  const getItemsToRender = () => {
    const { startIndex, endIndex } = visibleRange;
    const items: ReactNode[] = [];
    
    for (let i = startIndex; i <= endIndex; i++) {
      const item = data[i];
      if (!item) continue;
      
      const itemStyle: CSSProperties = {
        position: 'absolute',
        top: i * itemHeight,
        height: itemHeight,
        left: 0,
        right: 0,
      };
      
      items.push(
        <div
          key={i}
          className={`virtualized-list-item ${itemClassName}`}
          style={itemStyle}
        >
          {renderItem(item, i)}
        </div>
      );
    }
    
    return items;
  };
  
  // Container classes
  const containerClasses = `
    virtualized-list
    overflow-auto
    relative
    ${className}
  `;
  
  // Inner container classes
  const innerClasses = `
    virtualized-list-inner
    relative
    w-full
    ${innerClassName}
  `;
  
  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={{ height, width }}
      onScroll={handleScroll}
    >
      <div
        className={innerClasses}
        style={{ height: totalHeight }}
      >
        {getItemsToRender()}
      </div>
    </div>
  );
}

interface VirtualizedGridProps<T> extends Omit<VirtualizedListProps<T>, 'renderItem' | 'itemHeight'> {
  /**
   * Function to render each item
   */
  renderItem: (item: T, rowIndex: number, columnIndex: number) => ReactNode;
  /**
   * Height of each row in pixels
   */
  rowHeight: number;
  /**
   * Number of columns
   */
  columns: number;
  /**
   * Gap between items in pixels
   */
  gap?: number;
}

export function VirtualizedGrid<T>({
  data,
  renderItem,
  rowHeight,
  height,
  width = '100%',
  columns,
  gap = 8,
  overscan = 1,
  className = '',
  innerClassName = '',
  itemClassName = '',
  onVisibleRangeChange,
}: VirtualizedGridProps<T>) {
  // Calculate the number of rows
  const rowCount = Math.ceil(data.length / columns);
  
  // Render a row
  const renderRow = (rowIndex: number) => {
    const startIndex = rowIndex * columns;
    const rowItems: ReactNode[] = [];
    
    for (let i = 0; i < columns; i++) {
      const dataIndex = startIndex + i;
      if (dataIndex >= data.length) break;
      
      const item = data[dataIndex];
      
      rowItems.push(
        <div
          key={i}
          className={`virtualized-grid-item ${itemClassName}`}
          style={{
            flex: `1 0 calc(${100 / columns}% - ${gap * (columns - 1) / columns}px)`,
            marginRight: i < columns - 1 ? gap : 0,
          }}
        >
          {renderItem(item, rowIndex, i)}
        </div>
      );
    }
    
    return (
      <div
        className="virtualized-grid-row flex"
        style={{ height: rowHeight }}
      >
        {rowItems}
      </div>
    );
  };
  
  // Create a virtual list of rows
  return (
    <VirtualizedList
      data={Array.from({ length: rowCount }, (_, i) => i)}
      renderItem={renderRow}
      itemHeight={rowHeight + gap}
      height={height}
      width={width}
      overscan={overscan}
      className={`virtualized-grid ${className}`}
      innerClassName={innerClassName}
      onVisibleRangeChange={onVisibleRangeChange}
    />
  );
}