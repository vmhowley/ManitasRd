import React from 'react'
import {MapPin, ShoppingCart} from 'lucide-react'
import { CartProvider } from '../ServiceCartDrawer';
export const Header = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="bg-primary-100 dark:bg-white rounded-md p-2 w-10">
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
        <div className="dark:bg-white rounded-md p-2 w-10">          
            <ShoppingCart size={24} />
            <span className="absolute top-7 right-7 bg-danger-500 text-white text-xs rounded-full px-1">3</span>
            
        </div>
      </div>
    </div>
  );
}
