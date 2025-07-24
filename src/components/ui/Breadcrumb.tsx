import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  /**
   * Elementos de navegación para las migas de pan
   */
  items: BreadcrumbItem[];
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
  
  /**
   * Elemento separador entre items
   */
  separator?: React.ReactNode;
  
  /**
   * Mostrar icono de inicio
   */
  homeIcon?: boolean;
  
  /**
   * Ruta de inicio
   */
  homePath?: string;
  
  /**
   * Etiqueta para el icono de inicio (para accesibilidad)
   */
  homeLabel?: string;
  
  /**
   * Generar migas de pan automáticamente basado en la ruta actual
   */
  autoGenerate?: boolean;
  
  /**
   * Mapeo de rutas a etiquetas para generación automática
   */
  routeMapping?: Record<string, string>;
}

/**
 * Componente Breadcrumb - Muestra una navegación de migas de pan
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items: propItems,
  className = '',
  separator = <ChevronRight className="h-4 w-4 text-neutral-400" />,
  homeIcon = true,
  homePath = '/',
  homeLabel = 'Inicio',
  autoGenerate = false,
  routeMapping = {},
}) => {
  const location = useLocation();
  
  // Generar items automáticamente basado en la ruta actual si autoGenerate es true
  const generateBreadcrumbItems = (): BreadcrumbItem[] => {
    if (!autoGenerate) return propItems;
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    if (pathSegments.length === 0) return [];
    
    let currentPath = '';
    
    const generatedItems = pathSegments.map((segment) => {
      currentPath += `/${segment}`;
      
      // Usar el mapeo de rutas si está disponible, o capitalizar el segmento
      const label = routeMapping[segment] || 
                   segment.charAt(0).toUpperCase() + 
                   segment.slice(1).replace(/-/g, ' ');
      
      return {
        label,
        href: currentPath,
      };
    });
    
    return generatedItems;
  };
  
  const items = autoGenerate ? generateBreadcrumbItems() : propItems;
  
  if (!items.length) return null;

  return (
    <nav className={cn('flex', className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 flex-wrap">
        {homeIcon && (
          <li className="inline-flex items-center">
            <Link
              to={homePath}
              className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-primary-600 transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              <span className="sr-only">{homeLabel}</span>
            </Link>
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 || homeIcon ? <span className="mx-1 md:mx-2">{separator}</span> : null}
              
              {isLast ? (
                <span 
                  className="text-sm font-medium text-neutral-800 flex items-center" 
                  aria-current="page"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </span>
              ) : (
                item.href ? (
                  <Link
                    to={item.href}
                    onClick={item.onClick}
                    className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-primary-600 transition-colors"
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    {item.label}
                  </Link>
                ) : (
                  <span 
                    className="text-sm font-medium text-neutral-500 flex items-center"
                    onClick={item.onClick}
                    style={item.onClick ? { cursor: 'pointer' } : undefined}
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    {item.label}
                  </span>
                )
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};