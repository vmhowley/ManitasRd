import {MapPin, ShoppingCart, ArrowLeft} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === '/' ) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="bg-primary-100 hover:dark:bg-primary-100/20 dark:bg-white/10 rounded-md p-2 w-10">
          <MapPin size={24} />
        </div>
        <div className="grid">
          <label htmlFor="address" className="text-xs font-bold dark:text-white">Direccion de Servicio</label>
          <select name="address" id="address">
            <option value="address1">Calle Falsa 123</option>
            <option value="address2">Avenida Siempre Viva 456</option>
            <option value="address3">Calle Mira 789</option>
          </select>
        </div>
      </div>
      <div>
        <div className="dark:bg-transparent hover:bg-primary-100/20 rounded-md p-2 w-10">          
            <ShoppingCart size={24} />
            <span className="absolute top-7 right-7 bg-danger-500 text-white text-xs rounded-full px-1">3</span>
            
        </div>
      </div>
    </div>
  );
}else {
 return (
   <div className="flex items-center justify-between">
     <div className="flex items-center space-x-4">
       <button onClick={() => navigate(-1)} className="bg-primary-100 hover:dark:bg-primary-100/20 dark:bg-white/10 rounded-md p-2 w-10">
         <ArrowLeft size={24} />
       </button>
     </div>
     <div>
       <div className="dark:bg-transparent hover:bg-primary-100/20 rounded-md p-2 w-10">
         <ShoppingCart size={24} />
         <span className="absolute top-7 right-7 bg-danger-500 text-white text-xs rounded-full px-1">
           3
         </span>
       </div>
     </div>
   </div>
 );
  
}
}
