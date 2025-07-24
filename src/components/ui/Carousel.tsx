import React, { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  /**
   * The children to display in the carousel
   */
  children: ReactNode;
  /**
   * The index of the active slide (controlled)
   */
  activeIndex?: number;
  /**
   * The default index of the active slide (uncontrolled)
   */
  defaultActiveIndex?: number;
  /**
   * Callback when the active slide changes
   */
  onSlideChange?: (index: number) => void;
  /**
   * Whether to show navigation arrows
   */
  showArrows?: boolean;
  /**
   * Whether to show navigation dots
   */
  showDots?: boolean;
  /**
   * Whether to enable autoplay
   */
  autoplay?: boolean;
  /**
   * The interval for autoplay in milliseconds
   */
  autoplayInterval?: number;
  /**
   * Whether to pause autoplay on hover
   */
  pauseOnHover?: boolean;
  /**
   * Whether to enable infinite looping
   */
  infinite?: boolean;
  /**
   * Whether to enable swipe gestures on touch devices
   */
  swipeable?: boolean;
  /**
   * The animation duration in milliseconds
   */
  animationDuration?: number;
  /**
   * Custom class name for the container
   */
  className?: string;
  /**
   * Custom class name for the slides container
   */
  slidesClassName?: string;
  /**
   * Custom class name for the navigation arrows
   */
  arrowsClassName?: string;
  /**
   * Custom class name for the navigation dots
   */
  dotsClassName?: string;
}

export function Carousel({
  children,
  activeIndex,
  defaultActiveIndex = 0,
  onSlideChange,
  showArrows = true,
  showDots = true,
  autoplay = false,
  autoplayInterval = 5000,
  pauseOnHover = true,
  infinite = true,
  swipeable = true,
  animationDuration = 300,
  className = '',
  slidesClassName = '',
  arrowsClassName = '',
  dotsClassName = '',
}: CarouselProps) {
  // Convert children to array for easier handling
  const childrenArray = React.Children.toArray(children);
  const slideCount = childrenArray.length;

  // State for controlled/uncontrolled usage
  const [currentIndex, setCurrentIndex] = useState(defaultActiveIndex);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDelta, setDragDelta] = useState(0);
  
  // Refs
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Determine if component is controlled or uncontrolled
  const isControlled = activeIndex !== undefined;
  const currentSlide = isControlled ? activeIndex : currentIndex;

  // Handle slide change
  const goToSlide = useCallback((index: number) => {
    let newIndex = index;
    
    if (!infinite) {
      // Clamp index to valid range if not infinite
      newIndex = Math.max(0, Math.min(slideCount - 1, newIndex));
    } else {
      // Wrap around if infinite
      if (newIndex < 0) newIndex = slideCount - 1;
      if (newIndex >= slideCount) newIndex = 0;
    }
    
    if (!isControlled) {
      setCurrentIndex(newIndex);
    }
    
    onSlideChange?.(newIndex);
  }, [isControlled, infinite, onSlideChange, slideCount]);

  // Navigation handlers
  const goToPrevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [goToSlide, currentSlide]);

  const goToNextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [goToSlide, currentSlide]);

  // Autoplay functionality
  useEffect(() => {
    if (autoplay && !isHovering && !isDragging && slideCount > 1) {
      autoplayTimerRef.current = setTimeout(() => {
        goToNextSlide();
      }, autoplayInterval);
    }
    
    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, [autoplay, autoplayInterval, isHovering, isDragging, goToNextSlide, slideCount]);

  // Touch/mouse event handlers for swipe
  const handleDragStart = (clientX: number) => {
    if (!swipeable) return;
    
    setIsDragging(true);
    setDragStartX(clientX);
    setDragDelta(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || !swipeable) return;
    
    const delta = clientX - dragStartX;
    setDragDelta(delta);
  };

  const handleDragEnd = () => {
    if (!isDragging || !swipeable) return;
    
    const threshold = carouselRef.current?.offsetWidth || 0;
    const dragThreshold = threshold * 0.2; // 20% of carousel width
    
    if (Math.abs(dragDelta) > dragThreshold) {
      if (dragDelta > 0) {
        goToPrevSlide();
      } else {
        goToNextSlide();
      }
    }
    
    setIsDragging(false);
    setDragDelta(0);
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
    setIsHovering(false);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Calculate transform style based on current slide and drag delta
  const getTransformStyle = () => {
    const baseTransform = `translateX(-${currentSlide * 100}%)`;
    const dragTransform = isDragging ? `translateX(${dragDelta}px)` : '';
    const transform = isDragging ? dragTransform : baseTransform;
    
    return {
      transform,
      transition: isDragging ? 'none' : `transform ${animationDuration}ms ease-in-out`,
    };
  };

  // Container classes
  const containerClasses = `
    carousel
    relative
    overflow-hidden
    ${className}
  `;

  // Slides container classes
  const slidesContainerClasses = `
    carousel-slides
    flex
    w-full
    h-full
    ${slidesClassName}
  `;

  // Navigation arrow classes
  const arrowClasses = `
    carousel-arrow
    absolute
    top-1/2
    transform
    -translate-y-1/2
    z-10
    bg-white
    bg-opacity-70
    hover:bg-opacity-90
    rounded-full
    p-2
    shadow-md
    cursor-pointer
    transition-all
    ${arrowsClassName}
  `;

  // Navigation dots classes
  const dotsContainerClasses = `
    carousel-dots
    absolute
    bottom-4
    left-1/2
    transform
    -translate-x-1/2
    flex
    space-x-2
    z-10
    ${dotsClassName}
  `;

  return (
    <div
      ref={carouselRef}
      className={containerClasses}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div className={slidesContainerClasses} style={getTransformStyle()}>
        {childrenArray.map((child, index) => (
          <div
            key={index}
            className="carousel-slide flex-shrink-0 w-full h-full"
            aria-hidden={currentSlide !== index}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && slideCount > 1 && (
        <>
          <button
            type="button"
            className={`${arrowClasses} left-2`}
            onClick={goToPrevSlide}
            aria-label="Previous slide"
            disabled={!infinite && currentSlide === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            className={`${arrowClasses} right-2`}
            onClick={goToNextSlide}
            aria-label="Next slide"
            disabled={!infinite && currentSlide === slideCount - 1}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {showDots && slideCount > 1 && (
        <div className={dotsContainerClasses}>
          {childrenArray.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`
                carousel-dot
                w-3 h-3
                rounded-full
                transition-all
                ${currentSlide === index ? 'bg-white scale-125' : 'bg-white bg-opacity-50'}
              `}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={currentSlide === index}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CarouselItemProps {
  /**
   * The content of the carousel item
   */
  children: ReactNode;
  /**
   * Custom class name
   */
  className?: string;
}

export function CarouselItem({ children, className = '' }: CarouselItemProps) {
  return (
    <div className={`carousel-item w-full h-full ${className}`}>
      {children}
    </div>
  );
}