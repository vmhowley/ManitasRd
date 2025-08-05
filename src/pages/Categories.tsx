import { Search, Wrench, Zap, Droplets, Paintbrush, Scissors, Car, Home as HomeIcon, Wifi, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { categories } from '../data/categories';


export const Categories = () => {
  const handleCategoryClick = (category: string) => {
    console.log(`Clicked on category: ${category}`);
    // Aquí puedes agregar la lógica para navegar a la página de la categoría
  };
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center  min-h-screen gap-4">
      {categories.map((category) => {
        const Icon = category.icon; 
        return (
          <div onClick={() => navigate(category.path)} key={category.name} className="flex border rounded-md border-gray-800  w-full px- items-center  gap-2 p-2  ">
            <div className='flex items-center justify-center w-12 h-12 rounded border'>
            <Icon className="" />
            </div>
            <div className='grid grid-cols-1'>
            <h1 className="">{category.name}</h1>
            
            </div>
          </div>
        );
      })
      }
    </div>
  );
}            
           
  

