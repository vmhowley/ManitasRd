import { useState } from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'none';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  fallback?: string;
  className?: string;
  statusClassName?: string;
  onClick?: () => void;
  bordered?: boolean;
  square?: boolean;
}

export function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  status = 'none',
  fallback,
  className = '',
  statusClassName = '',
  onClick,
  bordered = false,
  square = false,
}: AvatarProps) {
  const [imageError, setImageError] = useState(!src);

  // Handle image load error
  const handleError = () => {
    setImageError(true);
  };

  // Size classes
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-24 w-24 text-2xl',
  };

  // Status classes
  const statusClasses = {
    online: 'bg-success-500',
    offline: 'bg-neutral-300',
    away: 'bg-warning-500',
    busy: 'bg-error-500',
    none: 'hidden',
  };

  // Status size based on avatar size
  const statusSizeClasses = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-3.5 w-3.5',
    '2xl': 'h-4 w-4',
  };

  // Generate initials from fallback text or alt text
  const getInitials = () => {
    const text = fallback || alt;
    if (!text) return '';
    
    return text
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get background color based on text
  const getBackgroundColor = () => {
    const text = fallback || alt;
    if (!text) return 'bg-primary-100';
    
    // Simple hash function to generate consistent color
    const hash = text.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    // Use hash to select from a set of predefined colors
    const colors = [
      'bg-primary-100',
      'bg-secondary-100',
      'bg-accent-100',
      'bg-success-100',
      'bg-warning-100',
      'bg-info-100',
    ];
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <div className="relative inline-block">
      <div
        className={`
          ${sizeClasses[size]}
          ${square ? 'rounded-md' : 'rounded-full'}
          ${bordered ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-100' : ''}
          overflow-hidden
          flex items-center justify-center
          ${onClick ? 'cursor-pointer' : ''}
          ${className}
        `}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        aria-label={alt}
      >
        {!imageError && src ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={handleError}
          />
        ) : (
          <div className={`h-full w-full flex items-center justify-center ${getBackgroundColor()} text-neutral-800 font-medium`}>
            {getInitials()}
          </div>
        )}
      </div>
      
      {/* Status indicator */}
      {status !== 'none' && (
        <span
          className={`absolute bottom-0 right-0 block ${statusSizeClasses[size]} ${statusClasses[status]} rounded-full ring-2 ring-white ${statusClassName}`}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}

// Avatar Group component for displaying multiple avatars
interface AvatarGroupProps {
  avatars: Array<Omit<AvatarProps, 'size'>>;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function AvatarGroup({ avatars, max = 4, size = 'md', className = '' }: AvatarGroupProps) {
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={`flex -space-x-4 ${className}`}>
      {displayAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          {...avatar}
          size={size}
          className={`${avatar.className || ''} ring-2 ring-white`}
        />
      ))}
      
      {remainingCount > 0 && (
        <div
          className={`
            ${size ? sizeClasses[size] : 'h-10 w-10'}
            rounded-full bg-neutral-100 flex items-center justify-center
            text-neutral-600 font-medium ring-2 ring-white
          `}
          aria-label={`${remainingCount} more avatars`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

// Re-export size classes for external use
const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
  '2xl': 'h-24 w-24 text-2xl',
};