import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Pagination } from './Pagination';
import { Spinner } from './Spinner';

// Table column definition
export interface TableColumn<T> {
  header: React.ReactNode;
  accessorKey?: keyof T;
  cell?: (info: { row: T; index: number }) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  minWidth?: string;
  maxWidth?: string;
  width?: string;
  hide?: boolean;
}

// Table props
export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  isLoading?: boolean;
  loadingText?: string;
  emptyText?: string;
  variant?: 'default' | 'striped' | 'bordered' | 'borderless';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: (row: T, index: number) => string;
  onRowClick?: (row: T, index: number) => void;
  sortable?: boolean;
  defaultSortColumn?: string;
  defaultSortDirection?: 'asc' | 'desc';
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  manualPagination?: boolean;
  stickyHeader?: boolean;
  highlightOnHover?: boolean;
  dense?: boolean;
  caption?: React.ReactNode;
  footer?: React.ReactNode;
  id?: string;
}

export function Table<T>({ 
  data = [],
  columns = [],
  isLoading = false,
  loadingText = 'Loading data...',
  emptyText = 'No data available',
  variant = 'default',
  size = 'md',
  className = '',
  tableClassName = '',
  headerClassName = '',
  bodyClassName = '',
  rowClassName,
  onRowClick,
  sortable = false,
  defaultSortColumn,
  defaultSortDirection = 'asc',
  pagination = false,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  totalItems,
  currentPage: controlledCurrentPage,
  onPageChange,
  onPageSizeChange,
  manualPagination = false,
  stickyHeader = false,
  highlightOnHover = true,
  dense = false,
  caption,
  footer,
  id,
}: TableProps<T>) {
  // State for sorting
  const [sortColumn, setSortColumn] = useState<string | undefined>(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  
  // Controlled vs uncontrolled pagination
  const isControlledPagination = controlledCurrentPage !== undefined;
  const activePage = isControlledPagination ? controlledCurrentPage : currentPage;
  
  // Reset pagination when data changes
  useEffect(() => {
    if (!isControlledPagination && !manualPagination) {
      setCurrentPage(1);
    }
  }, [data, isControlledPagination, manualPagination]);
  
  // Sort data if not manually paginated/sorted
  const sortedData = useMemo(() => {
    if (manualPagination || !sortable || !sortColumn) return data;
    
    return [...data].sort((a, b) => {
      const column = columns.find(col => col.accessorKey === sortColumn);
      if (!column || !column.accessorKey) return 0;
      
      const aValue = a[column.accessorKey];
      const bValue = b[column.accessorKey];
      
      if (aValue === bValue) return 0;
      
      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
      if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? 1 : -1;
      
      return sortDirection === 'asc' 
        ? (aValue < bValue ? -1 : 1) 
        : (bValue < aValue ? -1 : 1);
    });
  }, [data, columns, sortColumn, sortDirection, manualPagination, sortable]);
  
  // Paginate data if not manually paginated
  const paginatedData = useMemo(() => {
    if (manualPagination || !pagination) return sortedData;
    
    const start = (activePage - 1) * currentPageSize;
    const end = start + currentPageSize;
    
    return sortedData.slice(start, end);
  }, [sortedData, activePage, currentPageSize, manualPagination, pagination]);
  
  // Calculate total pages
  const totalPages = useMemo(() => {
    const total = totalItems || data.length;
    return Math.ceil(total / currentPageSize);
  }, [totalItems, data.length, currentPageSize]);
  
  // Handle sort
  const handleSort = (column: TableColumn<T>) => {
    if (!sortable || !column.sortable || !column.accessorKey) return;
    
    const isCurrentColumn = sortColumn === column.accessorKey;
    const newDirection = isCurrentColumn && sortDirection === 'asc' ? 'desc' : 'asc';
    
    setSortColumn(column.accessorKey as string);
    setSortDirection(newDirection);
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (!isControlledPagination) {
      setCurrentPage(page);
    }
    onPageChange?.(page);
  };
  
  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setCurrentPageSize(newPageSize);
    if (!isControlledPagination) {
      setCurrentPage(1);
    }
    onPageSizeChange?.(newPageSize);
  };
  
  // Size classes
  const sizeClasses = {
    sm: {
      table: 'text-xs',
      cell: 'px-2 py-1',
      header: 'px-2 py-1.5',
    },
    md: {
      table: 'text-sm',
      cell: 'px-3 py-2',
      header: 'px-3 py-3',
    },
    lg: {
      table: 'text-base',
      cell: 'px-4 py-3',
      header: 'px-4 py-4',
    },
  };
  
  // Variant classes
  const variantClasses = {
    default: {
      table: 'border-separate border-spacing-0',
      header: 'bg-neutral-50 text-neutral-700 font-medium border-b border-neutral-200',
      row: 'border-b border-neutral-200 last:border-b-0',
    },
    striped: {
      table: 'border-separate border-spacing-0',
      header: 'bg-neutral-50 text-neutral-700 font-medium border-b border-neutral-200',
      row: 'border-b border-neutral-200 last:border-b-0 even:bg-neutral-50',
    },
    bordered: {
      table: 'border-separate border-spacing-0 border border-neutral-200 rounded-md overflow-hidden',
      header: 'bg-neutral-50 text-neutral-700 font-medium border-b border-neutral-200',
      row: 'border-b border-neutral-200 last:border-b-0',
    },
    borderless: {
      table: 'border-separate border-spacing-0',
      header: 'bg-transparent text-neutral-700 font-medium border-b-2 border-neutral-200',
      row: 'border-b border-neutral-100 last:border-b-0',
    },
  };
  
  // Generate table ID
  const tableId = id || `table-${Math.random().toString(36).substring(2, 9)}`;
  
  // Visible columns
  const visibleColumns = columns.filter(column => !column.hide);
  
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="w-full overflow-x-auto">
        <table
          id={tableId}
          className={`
            w-full border-collapse
            ${sizeClasses[size].table}
            ${variantClasses[variant].table}
            ${dense ? 'table-dense' : ''}
            ${tableClassName}
          `}
        >
          {caption && <caption className="text-sm text-neutral-600 p-2 text-left">{caption}</caption>}
          
          <thead className={`${stickyHeader ? 'sticky top-0 z-10' : ''} ${headerClassName}`}>
            <tr>
              {visibleColumns.map((column, index) => {
                const isSortable = sortable && column.sortable && column.accessorKey;
                const isSorted = sortColumn === column.accessorKey;
                
                return (
                  <th
                    key={index}
                    className={`
                      ${sizeClasses[size].header}
                      ${variantClasses[variant].header}
                      ${column.align === 'center' ? 'text-center' : ''}
                      ${column.align === 'right' ? 'text-right' : ''}
                      ${isSortable ? 'cursor-pointer select-none' : ''}
                      ${column.headerClassName || ''}
                    `}
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      width: column.width,
                    }}
                    onClick={() => isSortable && handleSort(column)}
                    aria-sort={isSorted ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <div className={`flex items-center ${column.align === 'center' ? 'justify-center' : ''} ${column.align === 'right' ? 'justify-end' : ''}`}>
                      <span>{column.header}</span>
                      {isSortable && (
                        <span className="inline-flex ml-1">
                          {isSorted ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )
                          ) : (
                            <ChevronDown className="h-4 w-4 opacity-30" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          
          <tbody className={bodyClassName}>
            {isLoading ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="text-center py-8"
                >
                  <div className="flex flex-col items-center justify-center">
                    <Spinner size="md" color="primary" variant="border" />
                    <span className="mt-2 text-sm text-neutral-600">{loadingText}</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="text-center py-8 text-neutral-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`
                    ${variantClasses[variant].row}
                    ${highlightOnHover ? 'hover:bg-neutral-50' : ''}
                    ${onRowClick ? 'cursor-pointer' : ''}
                    ${rowClassName ? rowClassName(row, rowIndex) : ''}
                  `}
                  onClick={() => onRowClick && onRowClick(row, rowIndex)}
                >
                  {visibleColumns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`
                        ${sizeClasses[size].cell}
                        ${column.align === 'center' ? 'text-center' : ''}
                        ${column.align === 'right' ? 'text-right' : ''}
                        ${column.cellClassName || ''}
                      `}
                    >
                      {column.cell
                        ? column.cell({ row, index: rowIndex })
                        : column.accessorKey
                        ? String(row[column.accessorKey] ?? '')
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          
          {footer && (
            <tfoot className="bg-neutral-50 border-t border-neutral-200">
              {footer}
            </tfoot>
          )}
        </table>
      </div>
      
      {pagination && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-neutral-600">Rows per page:</span>
            <select
              value={currentPageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="
                text-sm border border-neutral-300 rounded-md
                py-1 pl-2 pr-8
                bg-white
                focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
              "
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <Pagination
            currentPage={activePage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            size="sm"
          />
        </div>
      )}
    </div>
  );
}

// Table skeleton loader
export interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  showHeader?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TableSkeleton({
  columns = 5,
  rows = 5,
  showHeader = true,
  size = 'md',
  className = '',
}: TableSkeletonProps) {
  // Size classes
  const sizeClasses = {
    sm: {
      cell: 'px-2 py-1',
      header: 'px-2 py-1.5',
      cellHeight: 'h-4',
      headerHeight: 'h-5',
    },
    md: {
      cell: 'px-3 py-2',
      header: 'px-3 py-3',
      cellHeight: 'h-5',
      headerHeight: 'h-6',
    },
    lg: {
      cell: 'px-4 py-3',
      header: 'px-4 py-4',
      cellHeight: 'h-6',
      headerHeight: 'h-7',
    },
  };
  
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse border-separate border-spacing-0">
          {showHeader && (
            <thead>
              <tr>
                {Array.from({ length: columns }).map((_, index) => (
                  <th key={index} className={`${sizeClasses[size].header} border-b border-neutral-200`}>
                    <div className={`${sizeClasses[size].headerHeight} bg-neutral-200 rounded animate-pulse w-3/4`}></div>
                  </th>
                ))}
              </tr>
            </thead>
          )}
          
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-neutral-200 last:border-b-0">
                {Array.from({ length: columns }).map((_, colIndex) => {
                  // Vary the widths to make it look more natural
                  const widthClass = colIndex === 0 
                    ? 'w-1/4' 
                    : colIndex === columns - 1 
                    ? 'w-1/6' 
                    : ['w-1/2', 'w-1/3', 'w-2/3'][colIndex % 3];
                  
                  return (
                    <td key={colIndex} className={sizeClasses[size].cell}>
                      <div 
                        className={`${sizeClasses[size].cellHeight} bg-neutral-200 rounded animate-pulse ${widthClass}`}
                      ></div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}