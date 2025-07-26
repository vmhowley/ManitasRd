import { Children, isValidElement, cloneElement, type ReactNode } from 'react';
import { Avatar } from './Avatar';

interface AvatarGroupProps {
  /**
   * The maximum number of avatars to display before showing a count
   */
  max?: number;
  /**
   * The size of the avatars
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * The spacing between avatars (negative value for overlap effect)
   */
  spacing?: number;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Avatar components to be displayed
   */
  children: ReactNode;
}

export function AvatarGroup({
  max = 5,
  size = 'md',
  spacing = -8,
  className = '',
  children,
}: AvatarGroupProps) {
  // Convert children to array and filter valid Avatar elements
  const avatarArray = Children.toArray(children).filter(
    (child) => isValidElement(child) && child.type === Avatar
  );

  // Determine if we need to show the count
  const showCount = max > 0 && avatarArray.length > max;
  const visibleAvatars = showCount ? avatarArray.slice(0, max) : avatarArray;
  const remainingCount = avatarArray.length - max;

  // Size classes mapping
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-14 w-14 text-xl',
  };

  // Create the count avatar if needed
  const countAvatar = showCount ? (
    <div
      className={`flex items-center justify-center rounded-full bg-neutral-200 text-neutral-700 font-medium ${sizeClasses[size]}`}
      style={{ zIndex: visibleAvatars.length + 1 }}
    >
      +{remainingCount}
    </div>
  ) : null;

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">
        {visibleAvatars.map((avatar, index) => {
          if (isValidElement(avatar)) {
            // Clone the avatar element to add custom props
            return cloneElement(avatar as any, {
              key: `avatar-${index}`,
              size: size,
              style: {
                marginLeft: index === 0 ? 0 : spacing,
                zIndex: visibleAvatars.length - index,
                ...(avatar.props as any).style,
              },
            });
          }
          return null;
        })}
        {countAvatar && (
          <div style={{ marginLeft: spacing, zIndex: 0 }}>{countAvatar}</div>
        )}
      </div>
    </div>
  );
}