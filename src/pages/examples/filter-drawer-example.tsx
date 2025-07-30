import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { FilterDrawer } from '../../components/FilterDrawer';
import { Button } from '../../components/ui/Button';

const FilterDrawerExamplePage: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const handleApplyFilters = (filters: Record<string, string[]>) => {
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Ejemplo de Drawer de Filtros</h1>
        
        <div className="p-6 border border-neutral-200 rounded-lg mb-8">
          <p className="mb-6">
            Este es un ejemplo de cómo se puede utilizar el componente FilterDrawer para implementar
            filtros en una página de búsqueda. Haga clic en el botón para abrir el drawer.
          </p>
          
          <FilterDrawer 
            filterGroups={[
              {
                id: 'category',
                name: 'Categoría',
                options: [
                  { id: 'electronics', label: 'Electrónicos' },
                  { id: 'clothing', label: 'Ropa' },
                  { id: 'books', label: 'Libros' }
                ]
              },
              {
                id: 'price',
                name: 'Precio',
                options: [
                  { id: 'low', label: 'Bajo ($0-$50)' },
                  { id: 'medium', label: 'Medio ($50-$200)' },
                  { id: 'high', label: 'Alto ($200+)' }
                ]
              }
            ]}
            selectedFilters={activeFilters}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />
        </div>
        
        {/* Mostrar filtros activos */}
        <div className="p-6 border border-neutral-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Filtros Activos</h2>
          
          {Object.keys(activeFilters).length === 0 ? (
            <p>No hay filtros activos.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(activeFilters).map(([category, values]) => (
                <div key={category}>
                  <h3 className="font-medium">{category}:</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {values.map(value => (
                      <span 
                        key={value} 
                        className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearFilters}
                className="mt-4"
              >
                Limpiar Todos los Filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FilterDrawerExamplePage;