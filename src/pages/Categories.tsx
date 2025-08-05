import { useNavigate } from "react-router-dom";
import { categories } from '../data/categories';


export const Categories = () => {

  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center  min-h-screen gap-4">
      {categories.map((category, index) => {
        const Icon = category.icon; 
        return (
          <div
            onClick={() => navigate(category?.path)}
            key={index}
            className="flex border rounded-md border-gray-800  w-full px- items-center  gap-2 p-2  "
          >
            <div className="flex items-center justify-center w-12 h-12 rounded bg-gray-800/60 ">
              <Icon className={category.color} />
            </div>
            <div className="grid grid-cols-1">
              <h1 className="">{category.name}</h1>
            </div>
          </div>
        );
      })
      }
    </div>
  );
}            
           
  

