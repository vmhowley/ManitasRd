import { Star, MapPin, Phone, MessageCircle } from 'lucide-react';
import type { User } from '../types/User';
import { getAvatarUrl } from '../utils/avatarUtils';

type Technician = User;

interface TechnicianCardProps {
  technician: Technician;
  onSelect?: (technician: Technician) => void;
  onContact?: (type: 'phone' | 'message') => void;
}

export const TechnicianCard: React.FC<TechnicianCardProps> = ({ technician, onSelect, onContact }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col">
      <div className="relative">
        <img 
          src={getAvatarUrl(technician.name)} 
          alt={technician.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
            {technician.name}
          </h3>
          {technician.rating !== undefined && (
            <div className="flex items-center text-sm text-gray-600">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span className="font-semibold">{technician.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        {technician.address && (
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className='line-clamp-1'>{technician.address}</span>
          </div>
        )}

        <p className="text-blue-600 font-medium text-sm mb-4 flex-grow">
          {technician.specialties?.join(', ') || 'Especialidades no especificadas'}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex space-x-2 w-full sm:w-auto mb-3 sm:mb-0">
            {technician.phone && (
              <button 
                onClick={() => onContact && onContact('phone')}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group-hover:border-blue-300 flex-1 sm:flex-none"
                title="Llamar"
              >
                <Phone className="h-5 w-5 text-gray-600" />
              </button>
            )}
            <button 
              onClick={() => onContact && onContact('message')}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group-hover:border-blue-300 flex-1 sm:flex-none"
              title="Enviar Mensaje"
            >
              <MessageCircle className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <button 
            onClick={() => onSelect && onSelect(technician)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold w-full sm:w-auto text-base"
          >
            Contratar
          </button>
        </div>
      </div>
    </div>
  );
};

