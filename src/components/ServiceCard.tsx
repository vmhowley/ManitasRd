import React from 'react';
import { Star, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { AddToCartButton } from './ServiceCartDrawer';

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
    category: string;
    rating?: number;
    eta?: string;
    location?: string;
  };
  variant?: 'default' | 'compact' | 'featured';
  onSelect?: () => void;
  showAddToCart?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  variant = 'default',
  onSelect,
  showAddToCart = true,
}) => {
  if (variant === 'compact') {
    return (
      <Card 
        className="group cursor-pointer transition-all duration-300 hover:shadow-md rounded-xl overflow-hidden dark:bg-neutral-800 dark:hover:shadow-neutral-900"
        onClick={onSelect}
      >
        <div className="flex items-center p-3">
          <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mr-3 flex-shrink-0">
            <span className="text-primary-600 dark:text-primary-400 font-medium">{service.name.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm text-neutral-800 dark:text-neutral-100 truncate">{service.name}</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{service.category}</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-sm text-primary-600 dark:text-primary-400">RD$ {service.price.toLocaleString()}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card className="overflow-hidden rounded-2xl h-36 relative cursor-pointer dark:bg-neutral-800" onClick={onSelect}>
        <img 
          src={service.image || `https://source.unsplash.com/random/300x200/?${service.category.toLowerCase()}`} 
          alt={service.name} 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
          {service.rating && (
            <Badge variant="primary" className="mb-1 w-fit dark:bg-primary-900 dark:text-primary-300">{service.rating.toFixed(1)} ★</Badge>
          )}
          <h3 className="text-white font-bold">{service.name}</h3>
          <p className="text-white/80 text-xs">Desde RD$ {service.price.toLocaleString()}</p>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card 
      className="group flex flex-col h-full transition-all duration-300 hover:translate-y-[-4px] rounded-xl overflow-hidden shadow-md hover:shadow-lg dark:bg-neutral-800 dark:shadow-neutral-900"
      onClick={onSelect}
    >
      <div className="relative overflow-hidden h-40">
        <img 
          src={service.image || `https://source.unsplash.com/random/300x200/?${service.category.toLowerCase()}`} 
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {service.rating !== undefined && (
          <Badge variant="warning" className="absolute top-3 right-3 flex items-center bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm text-neutral-800 dark:text-neutral-200 px-2.5 py-1 rounded-full shadow-md">
            <Star className="h-4 w-4 fill-current text-primary-500 dark:text-primary-400 mr-1" />
            <span className="font-medium">{service.rating.toFixed(1)}</span>
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4 flex-grow flex flex-col">
        <div>
          <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 group-hover:text-primary-600 transition-colors">
            {service.name}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{service.category}</p>
        </div>

        {service.description && (
          <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3 line-clamp-2">{service.description}</p>
        )}

        <div className="mt-auto">
          {service.location && (
            <div className="flex items-center text-xs text-neutral-600 dark:text-neutral-400 mb-2">
              <MapPin className="h-3.5 w-3.5 mr-1 text-primary-500" />
              <span>{service.location}</span>
            </div>
          )}
          
          {service.eta && (
            <div className="flex items-center text-xs text-neutral-600 dark:text-neutral-400 mb-3">
              <Clock className="h-3.5 w-3.5 mr-1 text-primary-500" />
              <span>Tiempo estimado: {service.eta}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <p className="font-bold text-primary-600">RD$ {service.price.toLocaleString()}</p>
            {showAddToCart && (
              <AddToCartButton service={service} size="sm" variant="primary">
                Agregar
              </AddToCartButton>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Skeleton loader for ServiceCard
import { Skeleton } from './ui/Skeleton';

export const ServiceCardSkeleton: React.FC<{variant?: 'default' | 'compact' | 'featured'}> = ({ variant = 'default' }) => {
  if (variant === 'compact') {
    return (
      <Card className="p-3">
        <div className="flex items-center">
          <Skeleton variant="circular" width="40px" height="40px" className="mr-3" />
          <div className="flex-1">
            <Skeleton variant="text" width="80%" height="16px" className="mb-1" />
            <Skeleton variant="text" width="60%" height="14px" />
          </div>
          <Skeleton variant="rectangular" width="60px" height="20px" className="rounded-md" />
        </div>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card className="overflow-hidden rounded-2xl h-36 relative">
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="flex flex-col h-full">
      <Skeleton variant="rectangular" width="100%" height="160px" />
      
      <div className="p-4">
        <Skeleton variant="text" width="70%" height="20px" className="mb-1" />
        <Skeleton variant="text" width="50%" height="16px" className="mb-3" />
        
        <Skeleton variant="text" width="100%" height="16px" className="mb-1" />
        <Skeleton variant="text" width="100%" height="16px" className="mb-3" />
        
        <Skeleton variant="text" width="60%" height="14px" className="mb-1" />
        <Skeleton variant="text" width="40%" height="14px" className="mb-3" />
        
        <div className="flex justify-between items-center">
          <Skeleton variant="rectangular" width="80px" height="24px" className="rounded-md" />
          <Skeleton variant="rectangular" width="100px" height="32px" className="rounded-md" />
        </div>
      </div>
    </Card>
  );
};