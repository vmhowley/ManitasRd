import {MapPin, ShoppingCart, ArrowLeft} from 'lucide-react'
import {  useLocation, useNavigate } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navLinks = [
    { name: 'Inicio', path: '/', icon: 'home' },
    { name: 'Categorias', path: '/categories', icon: 'categories' },
    { name: 'Servicios', path: '/services', icon: 'services' },
    { name: 'Chat', path: '/chat', icon: 'chat' },
    { name: 'Perfil', path: '/profile', icon: 'profile' },
  ];

  const found = navLinks.find(link => link.path === location.pathname);

  if (location.pathname === '/' ) {
  return (
    <div className="fixed top-0 left-0 w-full h-16 p-4  flex items-center justify-between">
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
            <span className="absolute top-4 right-5 bg-danger-500 text-white text-xs rounded-full px-1">3</span>
            
        </div>
      </div>
    </div>
  );
}else {
 return (
   <div className=" fixed top-0 left-0 w-full h-16 p-4  flex items-center justify-between bg-gray-950 border-b border-gray-800">
     <div className="flex items-center space-x-4">
       {found && <h1 className="text-xl font-bold text-white">{found.name}</h1>}
       {!found && (
         <button
           onClick={() => navigate(-1)}
           className="p-2 rounded-md hover:bg-primary-100/20"
         >
           <ArrowLeft size={24} />
         </button>
       )}
     </div>
     <div>
       <div className="dark:bg-transparent hover:bg-primary-100/20 rounded-md p-2 w-10">
         <ShoppingCart size={24} />
         <span className="absolute top-4 right-5 bg-danger-500 text-white text-xs rounded-full px-1">
           3
         </span>
       </div>
     </div>
   </div>
 );
  
}
}
