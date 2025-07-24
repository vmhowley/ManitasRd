import React from 'react';
import { cn } from '../../utils/cn';

export type SkeletonVariant = 'rectangular' | 'circular' | 'text' | 'card' | 'avatar' | 'button' | 'input';
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

export interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Variante del skeleton
   * @default 'text'
   */
  variant?: SkeletonVariant;
  
  /**
   * Tipo de animación
   * @default 'wave'
   */
  animation?: SkeletonAnimation;
  
  /**
   * Ancho del skeleton
   */
  width?: string | number;
  
  /**
   * Alto del skeleton
   */
  height?: string | number;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
  
  /**
   * Número de líneas (solo para variant='text')
   * @default 1
   */
  lines?: number;
  
  /**
   * Espaciado entre líneas (solo para variant='text')
   * @default 'mb-2'
   */
  lineSpacing?: string;
}

/**
 * Componente SkeletonLoader - Muestra un placeholder animado mientras se carga el contenido
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  animation = 'wave',
  width,
  height,
  className,
  lines = 1,
  lineSpacing = 'mb-2',
  ...props
}) => {
  // Clases base para todos los skeletons
  const baseClasses = cn(
    'bg-neutral-200 dark:bg-neutral-700',
    {
      'animate-pulse': animation === 'pulse',
      'skeleton-wave': animation === 'wave'
    },
    className
  );

  // Estilos inline para width y height
  const style: React.CSSProperties = {
    width: width,
    height: height,
    ...props.style
  };

  // Renderizar múltiples líneas para el skeleton de texto
  if (variant === 'text' && lines > 1) {
    return (
      <div {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              index < lines - 1 ? lineSpacing : '',
              'h-4 rounded'
            )}
            style={{
              ...style,
              width: typeof width === 'number' || typeof width === 'string' 
                ? width 
                : index === lines - 1 && lines > 1 
                  ? '80%' 
                  : '100%'
            }}
          />
        ))}
      </div>
    );
  }

  // Renderizar un solo skeleton basado en la variante
  switch (variant) {
    case 'circular':
      return (
        <div
          className={cn(baseClasses, 'rounded-full')}
          style={style}
          {...props}
        />
      );
    case 'text':
      return (
        <div
          className={cn(baseClasses, 'h-4 rounded')}
          style={style}
          {...props}
        />
      );
    case 'card':
      return (
        <div
          className={cn(baseClasses, 'rounded-lg')}
          style={{ height: height || '200px', width: width || '100%', ...props.style }}
          {...props}
        />
      );
    case 'avatar':
      return (
        <div
          className={cn(baseClasses, 'rounded-full')}
          style={{ height: height || '40px', width: width || '40px', ...props.style }}
          {...props}
        />
      );
    case 'button':
      return (
        <div
          className={cn(baseClasses, 'rounded-md')}
          style={{ height: height || '38px', width: width || '100px', ...props.style }}
          {...props}
        />
      );
    case 'input':
      return (
        <div
          className={cn(baseClasses, 'rounded-md')}
          style={{ height: height || '40px', width: width || '100%', ...props.style }}
          {...props}
        />
      );
    case 'rectangular':
    default:
      return (
        <div
          className={cn(baseClasses, 'rounded-md')}
          style={style}
          {...props}
        />
      );
  }
};

/**
 * Componente SkeletonText - Atajo para crear skeletons de texto
 */
export const SkeletonText: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
  <SkeletonLoader variant="text" {...props} />
);

/**
 * Componente SkeletonAvatar - Atajo para crear skeletons de avatar
 */
export const SkeletonAvatar: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
  <SkeletonLoader variant="avatar" {...props} />
);

/**
 * Componente SkeletonButton - Atajo para crear skeletons de botón
 */
export const SkeletonButton: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
  <SkeletonLoader variant="button" {...props} />
);

/**
 * Componente SkeletonCard - Atajo para crear skeletons de tarjeta
 */
export const SkeletonCard: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
  <SkeletonLoader variant="card" {...props} />
);

/**
 * Componente SkeletonInput - Atajo para crear skeletons de input
 */
export const SkeletonInput: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
  <SkeletonLoader variant="input" {...props} />
);