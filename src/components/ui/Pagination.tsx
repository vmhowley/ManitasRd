import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
  showFirstLast?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'simple';
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = '',
  showFirstLast = true,
  size = 'md',
  variant = 'default',
}: PaginationProps) {
  // Prevent invalid page numbers
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

  // Generate page numbers to display
  const getPageNumbers = () => {
    // For simple variant, don't generate page numbers
    if (variant === 'simple') return [];

    const pageNumbers: (number | 'ellipsis')[] = [];
    
    // Calculate range of visible page numbers
    const leftSiblingIndex = Math.max(validCurrentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(validCurrentPage + siblingCount, totalPages);
    
    // Show dots only if there's more than 1 page outside the range
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;
    
    // Always show first page
    if (showFirstLast) {
      pageNumbers.push(1);
    }
    
    // Add left ellipsis if needed
    if (showLeftDots) {
      pageNumbers.push('ellipsis');
    } else if (leftSiblingIndex === 2) {
      // If we're only hiding one page, just show it
      pageNumbers.push(2);
    }
    
    // Add page numbers in the middle
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      // Skip first and last if they're already included
      if ((i === 1 && showFirstLast) || (i === totalPages && showFirstLast)) continue;
      pageNumbers.push(i);
    }
    
    // Add right ellipsis if needed
    if (showRightDots) {
      pageNumbers.push('ellipsis');
    } else if (rightSiblingIndex === totalPages - 1) {
      // If we're only hiding one page, just show it
      pageNumbers.push(totalPages - 1);
    }
    
    // Always show last page
    if (showFirstLast) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  // Size classes for buttons
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8 text-xs';
      case 'lg': return 'h-12 w-12 text-base';
      default: return 'h-10 w-10 text-sm';
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page !== validCurrentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Render pagination buttons
  const renderPageButtons = () => {
    const pageNumbers = getPageNumbers();
    
    return pageNumbers.map((pageNumber, index) => {
      if (pageNumber === 'ellipsis') {
        return (
          <span 
            key={`ellipsis-${index}`} 
            className={`flex items-center justify-center ${getSizeClasses()}`}
          >
            <MoreHorizontal className="h-5 w-5 text-neutral-400" />
          </span>
        );
      }
      
      const isActive = pageNumber === validCurrentPage;
      
      return (
        <Button
          key={pageNumber}
          variant={isActive ? 'primary' : 'outline'}
          size="sm"
          className={`${getSizeClasses()} ${isActive ? '' : 'hover:bg-neutral-100'}`}
          onClick={() => handlePageChange(pageNumber)}
          aria-current={isActive ? 'page' : undefined}
          aria-label={`Page ${pageNumber}`}
        >
          {pageNumber}
        </Button>
      );
    });
  };

  // Render simple pagination (just prev/next)
  const renderSimplePagination = () => {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(validCurrentPage - 1)}
          disabled={validCurrentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm text-neutral-700">
          Page {validCurrentPage} of {totalPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(validCurrentPage + 1)}
          disabled={validCurrentPage >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      className={`flex items-center justify-center ${className}`}
      aria-label="Pagination"
    >
      {variant === 'simple' ? (
        renderSimplePagination()
      ) : (
        <div className="flex items-center space-x-2">
          {/* Previous button */}
          <Button
            variant="outline"
            size="sm"
            className={getSizeClasses()}
            onClick={() => handlePageChange(validCurrentPage - 1)}
            disabled={validCurrentPage <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          {/* Page numbers */}
          {renderPageButtons()}
          
          {/* Next button */}
          <Button
            variant="outline"
            size="sm"
            className={getSizeClasses()}
            onClick={() => handlePageChange(validCurrentPage + 1)}
            disabled={validCurrentPage >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </nav>
  );
}