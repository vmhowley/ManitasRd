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
      className="group flex flex-col h-full transition-all duration-300 hover:translate-y-[-4px] rounded-3xl overflow-hidden shadow-lg hover:shadow-xl"
    >
      <div className="relative overflow-hidden">
        <img 
          src={getAvatarUrl(technician.name)} 
          alt={technician.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {technician.rating !== undefined && (
          <Badge variant="warning" className="absolute top-3 right-3 flex items-center bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm text-neutral-800 dark:text-neutral-200 px-2.5 py-1 rounded-full shadow-md">
            <Star className="h-4 w-4 fill-current text-primary-500 dark:text-primary-400 mr-1" />
            <span className="font-medium">{technician.rating.toFixed(1)}</span>
          </Badge>
        )}
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {technician.name}
            </CardTitle>
          </div>
          
          {technician.address && (
            <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className='line-clamp-1'>{technician.address}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0 mt-4 space-y-4">
          {technician.specialties && technician.specialties.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {technician.specialties.slice(0, 3).map((specialty, index) => (
                <Badge key={index} variant="outline" className="text-xs px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800">
                  {specialty}
                </Badge>
              ))}
              {technician.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-600">
                  +{technician.specialties.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 rounded-full w-fit">
            <MapPin className="h-4 w-4 mr-1.5 text-primary-500 dark:text-primary-400" />
            <span>{technician.location || 'No especificado'}</span>
          </div>
        </CardContent>
        
        <CardFooter className="p-0 mt-6 pt-6 border-t dark:border-neutral-700 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Phone className="h-4 w-4" />}
            onClick={() => onContact && onContact('phone')}
            className="rounded-full px-4 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            Llamar
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            leftIcon={<MessageCircle className="h-4 w-4" />}
            onClick={() => onContact && onContact('message')}
            className="rounded-full px-4"
          >
            Mensaje
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