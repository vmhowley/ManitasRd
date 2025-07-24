import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
  width?: string;
  height?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseStyles = 'bg-neutral-200 dark:bg-neutral-700';
  
  const variantStyles = {
    rectangular: 'rounded-md',
    circular: 'rounded-full',
    text: 'rounded h-4',
  };
  
  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: '',
  };
  
  const customStyles = {
    width: width || (variant === 'text' ? '100%' : 'auto'),
    height: height || (variant === 'text' ? '1rem' : 'auto'),
  };
  
  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={customStyles}
    />
  );
};

// Predefined skeleton components for common use cases
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className = '' 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          variant="text" 
          width={i === lines - 1 && lines > 1 ? '80%' : '100%'} 
        />
      ))}
    </div>
  );
};

export const SkeletonAvatar: React.FC<{ size?: string; className?: string }> = ({ 
  size = '3rem', 
  className = '' 
}) => {
  return (
    <Skeleton 
      variant="circular" 
      width={size} 
      height={size} 
      className={className} 
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ 
  className = '' 
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <Skeleton variant="rectangular" height="12rem" />
      <div className="space-y-2">
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="60%" />
      </div>
    </div>
  );
};

// Add this to your global CSS or index.css
// .skeleton-wave {
//   position: relative;
//   overflow: hidden;
// }
// 
// .skeleton-wave::after {
//   position: absolute;
//   top: 0;
//   right: 0;
//   bottom: 0;
//   left: 0;
//   transform: translateX(-100%);
//   background: linear-gradient(
//     90deg,
//     rgba(255, 255, 255, 0) 0,
//     rgba(255, 255, 255, 0.2) 20%,
//     rgba(255, 255, 255, 0.5) 60%,
//     rgba(255, 255, 255, 0)
//   );
//   animation: shimmer 2s infinite;
//   content: '';
// }
// 
// @keyframes shimmer {
//   100% {
//     transform: translateX(100%);
//   }
// }