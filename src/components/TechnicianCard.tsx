import { Star, MapPin, Phone, MessageCircle } from 'lucide-react';
import type { User } from '../types/User';
import { getAvatarUrl } from '../utils/avatarUtils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Badge, Button } from './ui';

type Technician = User;

interface TechnicianCardProps {
  technician: Technician;
  onSelect?: (technician: Technician) => void;
  onContact?: (type: 'phone' | 'message') => void;
  isLoading?: boolean;
}

export const TechnicianCard: React.FC<TechnicianCardProps> = ({ 
  technician, 
  onSelect, 
  onContact,
  isLoading = false
}) => {
  if (isLoading) {
    return <TechnicianCardSkeleton />;
  }
  
  return (
    <Card 
      variant="elevated" 
      padding="none" 
      className="group flex flex-col h-full transition-all duration-300 hover:translate-y-[-4px]"
    >
      <div className="relative overflow-hidden">
        <img 
          src={getAvatarUrl(technician.name)} 
          alt={technician.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl group-hover:text-primary-600 transition-colors">
              {technician.name}
            </CardTitle>
            {technician.rating !== undefined && (
              <Badge variant="warning" className="flex items-center">
                <Star className="h-4 w-4 fill-current mr-1" />
                <span>{technician.rating.toFixed(1)}</span>
              </Badge>
            )}
          </div>
          
          {technician.address && (
            <div className="flex items-center text-sm text-neutral-600 mt-2">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className='line-clamp-1'>{technician.address}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0 mt-3 flex-grow">
          <div className="flex flex-wrap gap-1 mb-2">
            {technician.specialties?.map((specialty, index) => (
              <Badge key={index} variant="primary" size="sm">
                {specialty}
              </Badge>
            )) || (
              <Badge variant="default" size="sm">
                Especialidades no especificadas
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-0 mt-4 pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex space-x-2 w-full sm:w-auto">
            {technician.phone && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onContact && onContact('phone')}
                aria-label="Llamar"
              >
                <Phone className="h-5 w-5" />
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onContact && onContact('message')}
              aria-label="Enviar Mensaje"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          </div>
          <Button 
            variant="primary" 
            size="md"
            isFullWidth
            onClick={() => onSelect && onSelect(technician)}
            className="sm:ml-auto"
          >
            Contratar
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

// Skeleton loader for TechnicianCard
import { Skeleton } from './ui/Skeleton';

export const TechnicianCardSkeleton: React.FC = () => {
  return (
    <Card variant="elevated" padding="none" className="flex flex-col h-full">
      <div className="h-48 bg-neutral-200 animate-pulse"></div>
      
      <div className="p-6 flex-grow flex flex-col">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            <div className="w-1/2">
              <Skeleton variant="text" height="1.5rem" />
            </div>
            <Skeleton variant="rectangular" width="3rem" height="1.5rem" className="rounded-full" />
          </div>
          
          <div className="mt-2">
            <Skeleton variant="text" width="80%" />
          </div>
        </CardHeader>

        <CardContent className="p-0 mt-3 flex-grow">
          <div className="flex flex-wrap gap-1">
            <Skeleton variant="rectangular" width="5rem" height="1.25rem" className="rounded-full" />
            <Skeleton variant="rectangular" width="7rem" height="1.25rem" className="rounded-full" />
            <Skeleton variant="rectangular" width="6rem" height="1.25rem" className="rounded-full" />
          </div>
        </CardContent>
        
        <CardFooter className="p-0 mt-4 pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex space-x-2 w-full sm:w-auto">
            <Skeleton variant="rectangular" width="2.5rem" height="2.5rem" className="rounded-md" />
            <Skeleton variant="rectangular" width="2.5rem" height="2.5rem" className="rounded-md" />
          </div>
          <Skeleton variant="rectangular" width="100%" height="2.5rem" className="rounded-md sm:w-24" />
        </CardFooter>
      </div>
    </Card>
  );
};