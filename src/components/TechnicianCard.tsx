import { Star, MapPin, Phone, MessageCircle } from 'lucide-react';
import type { User } from '../types/User';
import { getAvatarUrl } from '../utils/avatarUtils';

interface Technician extends User {}

interface TechnicianCardProps {
  technician: Technician;
  onSelect?: (technician: Technician) => void;
  onContact?: (type: 'phone' | 'message') => void;
}

export const TechnicianCard: React.FC<TechnicianCardProps> = ({ technician, onSelect, onContact }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="relative">
        <img 
          src={getAvatarUrl(technician.name)} 
          alt={technician.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Removed technician.verified and technician.available as they are not in User type */}
      </div>
      
      <div className="p-6">
        <div className="grid items-center  justify-between mb-3">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
            {technician.name}
          </h3>
          {technician.address && (
            <div className="flex   items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span className='line-clamp-1'>{technician.address}</span>
            </div>
          )}
        </div>
        
        <p className="text-blue-600 font-medium mb-3">{technician.specialties?.join(', ')}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {technician.rating && (
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 font-semibold">{technician.rating}</span>
              </div>
            )}
            
          </div>
          
          {/* Removed responseTime as it is not in User type */}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-0">
          <div className="flex space-x-2 w-full sm:w-auto mb-3 sm:mb-0">
            {technician.phone && (
              <button 
                onClick={() => onContact && onContact('phone')}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group-hover:border-blue-300 w-1/2 sm:w-auto"
              >
                <Phone className="h-4 w-4" />
              </button>
            )}
            <button 
              onClick={() => onContact && onContact('message')}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group-hover:border-blue-300 w-1/2 sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
          </div>
          <button 
            onClick={() => onSelect && onSelect(technician)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium w-full sm:w-auto"
          >
            Contratar
          </button>
        </div>
        
        {/* Removed verified section as it is not in User type */}
      </div>
    </div>
  );
};

