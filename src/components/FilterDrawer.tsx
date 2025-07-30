import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { DrawerContent, DrawerProvider, DrawerTrigger } from './ui/Drawer';
import { Button } from './ui/Button';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterGroup {
  id: string;
  name: string;
  options: FilterOption[];
}

interface FilterDrawerProps {
  title?: string;
  filterGroups: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onApplyFilters: (filters: Record<string, string[]>) => void;
  onClearFilters: () => void;
  mobileOnly?: boolean;
}

export const FilterDrawer = ({
  title = 'Filtros',
  filterGroups,
  selectedFilters,
  onApplyFilters,
  onClearFilters,
  mobileOnly = false,
}: FilterDrawerProps) => {
  // Local state to track filter changes before applying
  const [localFilters, setLocalFilters] = useState<Record<string, string[]>>(selectedFilters);


  // Reset local filters when selected filters change (e.g. when cleared externally)
  React.useEffect(() => {
    setLocalFilters(selectedFilters);
  }, [selectedFilters]);

  // Toggle a filter option
  const toggleFilter = (groupId: string, optionId: string) => {
    setLocalFilters(prev => {
      const currentGroupFilters = prev[groupId] || [];
      const newGroupFilters = currentGroupFilters.includes(optionId)
        ? currentGroupFilters.filter(id => id !== optionId)
        : [...currentGroupFilters, optionId];

      return {
        ...prev,
        [groupId]: newGroupFilters,
      };
    });
  };

  // Apply filters
  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
  };

  // Clear filters
  const handleClearFilters = () => {
    const emptyFilters = Object.keys(localFilters).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {} as Record<string, string[]>);
    
    setLocalFilters(emptyFilters);
    onClearFilters();
  };

  // Count total selected filters
  const selectedCount = Object.values(localFilters).reduce(
    (count, options) => count + options.length, 
    0
  );

  // Filter content
  const FilterContent = () => (
    <div className="space-y-6">
      {filterGroups.map((group) => (
        <div key={group.id} className="space-y-3">
          <h3 className="font-medium text-neutral-900">{group.name}</h3>
          <div className="space-y-2">
            {group.options.map((option) => {
              const isSelected = (localFilters[group.id] || []).includes(option.id);
              return (
                <div key={option.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${group.id}-${option.id}`}
                    checked={isSelected}
                    onChange={() => toggleFilter(group.id, option.id)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  />
                  <label
                    htmlFor={`${group.id}-${option.id}`}
                    className="ml-2 text-sm text-neutral-700"
                  >
                    {option.label}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  // Mobile drawer version
  const MobileFilterDrawer = () => (
    <div className={mobileOnly ? '' : 'md:hidden'}>
      <DrawerProvider>
        <DrawerTrigger>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Filter className="h-4 w-4" />}
            rightIcon={selectedCount > 0 ? <span className="bg-primary-100 text-primary-800 text-xs font-medium rounded-full px-2 py-0.5">{selectedCount}</span> : undefined}
          >
            Filtros
          </Button>
        </DrawerTrigger>
        <DrawerContent
          position="right"
          size="sm"
          title={title}
          footer={
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                disabled={selectedCount === 0}
              >
                Limpiar
              </Button>
              <Button onClick={handleApplyFilters}>
                Aplicar
              </Button>
            </div>
          }
        >
          <FilterContent />
        </DrawerContent>
      </DrawerProvider>
    </div>
  );

  // Desktop sidebar version
  const DesktopFilterSidebar = () => {
    if (mobileOnly) return null;
    
    return (
      <div className="hidden md:block w-64 bg-white p-4 rounded-lg border border-neutral-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">{title}</h2>
          {selectedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              leftIcon={<X className="h-4 w-4" />}
            >
              Limpiar
            </Button>
          )}
        </div>
        <FilterContent />
        <div className="mt-6">
          <Button onClick={handleApplyFilters} isFullWidth>
            Aplicar Filtros
          </Button>
        </div>
      </div>
    );
  };



  return (
    <div className="flex space-x-4">
      <MobileFilterDrawer />
      <DesktopFilterSidebar />
    </div>
  );
};

// Example usage component
export const FilterDrawerExample = () => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    categories: [],
    price: [],
    rating: [],
  });

  const filterGroups: FilterGroup[] = [
    {
      id: 'categories',
      name: 'Categorías',
      options: [
        { id: 'plumbing', label: 'Plomería' },
        { id: 'electrical', label: 'Electricidad' },
        { id: 'cleaning', label: 'Limpieza' },
        { id: 'carpentry', label: 'Carpintería' },
        { id: 'painting', label: 'Pintura' },
      ],
    },
    {
      id: 'price',
      name: 'Precio',
      options: [
        { id: 'low', label: 'Económico' },
        { id: 'medium', label: 'Intermedio' },
        { id: 'high', label: 'Premium' },
      ],
    },
    {
      id: 'rating',
      name: 'Calificación',
      options: [
        { id: '5', label: '5 estrellas' },
        { id: '4', label: '4+ estrellas' },
        { id: '3', label: '3+ estrellas' },
      ],
    },
  ];

  const handleApplyFilters = (filters: Record<string, string[]>) => {
    setSelectedFilters(filters);
    console.log('Filters applied:', filters);
  };

  const handleClearFilters = () => {
    setSelectedFilters({
      categories: [],
      price: [],
      rating: [],
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Buscar Servicios</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <FilterDrawer
          title="Filtrar Servicios"
          filterGroups={filterGroups}
          selectedFilters={selectedFilters}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />
        
        <div className="flex-1 bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-neutral-500">
            {Object.values(selectedFilters).some(arr => arr.length > 0)
              ? 'Resultados filtrados'
              : 'Sin filtros aplicados'}
          </p>
          {/* Aquí irían los resultados filtrados */}
        </div>
      </div>
    </div>
  );
};