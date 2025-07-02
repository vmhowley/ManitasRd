import { Star, MapPin, CheckCircle, Phone, MessageCircle, Clock, Award } from 'lucide-react';

interface Technician {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  price: string;
  distance: string;
  verified: boolean;
  available?: boolean;
  responseTime?: string;
  image: string;
}

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
          src={technician.image} 
          alt={technician.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {technician.verified && (
          <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2">
            <CheckCircle className="h-4 w-4 text-white" />
          </div>
        )}
        {technician.available !== undefined && (
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${
            technician.available 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {technician.available ? 'Disponible' : 'Ocupado'}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
            {technician.name}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{technician.distance}</span>
          </div>
        </div>
        
        <p className="text-blue-600 font-medium mb-3">{technician.specialty}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 font-semibold">{technician.rating}</span>
            </div>
            <span className="text-gray-500 text-sm ml-2">({technician.reviews} reseñas)</span>
          </div>
          
          {technician.responseTime && (
            <div className="flex items-center text-xs text-gray-600">
              <Clock className="h-3 w-3 mr-1" />
              <span>{technician.responseTime}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">{technician.price}</span>
          <div className="flex space-x-2">
            <button 
              onClick={() => onContact && onContact('phone')}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group-hover:border-blue-300"
            >
              <Phone className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onContact && onContact('message')}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group-hover:border-blue-300"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onSelect && onSelect(technician)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Contratar
            </button>
          </div>
        </div>
        
        {technician.verified && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center text-xs text-green-600">
              <Award className="h-3 w-3 mr-1" />
              <span>Técnico verificado y asegurado</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

