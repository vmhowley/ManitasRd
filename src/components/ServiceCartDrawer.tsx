import React, { createContext, useContext, useState } from 'react';
import { ShoppingCart, X, ChevronRight, Calendar, Clock } from 'lucide-react';
import { Drawer, DrawerContent, DrawerProvider, DrawerTrigger } from './ui/Drawer';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

// Define the service type
interface Service {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category: string;
}

// Define the cart item type
interface CartItem {
  service: Service;
  quantity: number;
  date?: string;
  time?: string;
  notes?: string;
}

// Define the context type
interface CartContextType {
  items: CartItem[];
  addItem: (service: Service) => void;
  removeItem: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  updateSchedule: (serviceId: string, date?: string, time?: string) => void;
  updateNotes: (serviceId: string, notes: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Calculate total items and price
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.service.price * item.quantity), 0);

  // Add item to cart
  const addItem = (service: Service) => {
    setItems(prev => {
      // Check if item already exists
      const existingItemIndex = prev.findIndex(item => item.service.id === service.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const newItems = [...prev];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1
        };
        return newItems;
      } else {
        // Add new item
        return [...prev, { service, quantity: 1 }];
      }
    });
    
    // Open cart when adding items
    setIsOpen(true);
  };

  // Remove item from cart
  const removeItem = (serviceId: string) => {
    setItems(prev => prev.filter(item => item.service.id !== serviceId));
  };

  // Update item quantity
  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(serviceId);
      return;
    }
    
    setItems(prev => 
      prev.map(item => 
        item.service.id === serviceId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  // Update schedule for an item
  const updateSchedule = (serviceId: string, date?: string, time?: string) => {
    setItems(prev => 
      prev.map(item => 
        item.service.id === serviceId 
          ? { ...item, date, time } 
          : item
      )
    );
  };

  // Update notes for an item
  const updateNotes = (serviceId: string, notes: string) => {
    setItems(prev => 
      prev.map(item => 
        item.service.id === serviceId 
          ? { ...item, notes } 
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };

  // Open cart
  const openCart = () => {
    setIsOpen(true);
  };

  // Close cart
  const closeCart = () => {
    setIsOpen(false);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      updateSchedule,
      updateNotes,
      clearCart,
      totalItems,
      totalPrice,
      isOpen,
      openCart,
      closeCart
    }}>
      {children}
      
      {/* Cart Drawer */}
      <Drawer
        isOpen={isOpen}
        onClose={closeCart}
        position="right"
        size="md"
        title="Carrito de Servicios"
        footer={
          items.length > 0 ? (
            <div className="space-y-4 w-full">
              <div className="flex justify-between items-center font-medium text-lg">
                <span>Total:</span>
                <span>RD$ {totalPrice.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="ghost"
                  onClick={clearCart}
                >
                  Vaciar Carrito
                </Button>
                <Button
                  onClick={() => {
                    // Handle checkout logic
                    closeCart();
                    // Navigate to checkout page or show checkout modal
                  }}
                >
                  Proceder al Pago
                </Button>
              </div>
            </div>
          ) : null
        }
      >
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
            <ShoppingCart className="h-12 w-12 mb-4 text-neutral-300" />
            <p className="text-center mb-4">Tu carrito está vacío</p>
            <Button
              variant="outline"
              onClick={closeCart}
            >
              Explorar Servicios
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemCard 
                key={item.service.id} 
                item={item} 
                onRemove={() => removeItem(item.service.id)}
                onUpdateQuantity={(quantity) => updateQuantity(item.service.id, quantity)}
                onUpdateSchedule={(date, time) => updateSchedule(item.service.id, date, time)}
                onUpdateNotes={(notes) => updateNotes(item.service.id, notes)}
              />
            ))}
          </div>
        )}
      </Drawer>
    </CartContext.Provider>
  );
};

// Hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart item card component
interface CartItemCardProps {
  item: CartItem;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
  onUpdateSchedule: (date?: string, time?: string) => void;
  onUpdateNotes: (notes: string) => void;
}

const CartItemCard = ({
  item,
  onRemove,
  onUpdateQuantity,
  onUpdateSchedule,
  onUpdateNotes
}: CartItemCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState(item.notes || '');

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleNotesSave = () => {
    onUpdateNotes(notes);
  };

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      {/* Main card content */}
      <div className="p-3">
        <div className="flex justify-between">
          <div className="flex-1">
            <h3 className="font-medium">{item.service.name}</h3>
            <p className="text-sm text-neutral-600">{item.service.category}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-neutral-400 hover:text-danger-500 p-1"
            onClick={onRemove}
            aria-label="Eliminar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="xs"
              className="h-6 w-6 p-0"
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label="Disminuir cantidad"
            >
              -
            </Button>
            <span className="text-sm font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="xs"
              className="h-6 w-6 p-0"
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              aria-label="Aumentar cantidad"
            >
              +
            </Button>
          </div>
          <div className="text-right">
            <p className="font-medium">RD$ {(item.service.price * item.quantity).toLocaleString()}</p>
            <p className="text-xs text-neutral-500">RD$ {item.service.price.toLocaleString()} / unidad</p>
          </div>
        </div>
        
        {/* Schedule info if available */}
        {(item.date || item.time) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {item.date && (
              <Badge variant="outline" size="sm" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {item.date}
              </Badge>
            )}
            {item.time && (
              <Badge variant="outline" size="sm" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {item.time}
              </Badge>
            )}
          </div>
        )}
        
        {/* Expand/collapse button */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 flex justify-between items-center text-neutral-600"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>{isExpanded ? 'Menos detalles' : 'Más detalles'}</span>
          <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </Button>
      </div>
      
      {/* Expanded content */}
      {isExpanded && (
        <div className="p-3 bg-neutral-50 border-t border-neutral-200">
          <div className="space-y-3">
            {/* Schedule selector */}
            <div>
              <h4 className="text-sm font-medium mb-2">Programar servicio</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-neutral-600 mb-1 block">Fecha</label>
                  <input
                    type="date"
                    className="w-full text-sm p-1.5 border border-neutral-300 rounded"
                    value={item.date || ''}
                    onChange={(e) => onUpdateSchedule(e.target.value, item.time)}
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-600 mb-1 block">Hora</label>
                  <input
                    type="time"
                    className="w-full text-sm p-1.5 border border-neutral-300 rounded"
                    value={item.time || ''}
                    onChange={(e) => onUpdateSchedule(item.date, e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Notes */}
            <div>
              <label className="text-sm font-medium mb-1 block">Notas adicionales</label>
              <textarea
                className="w-full text-sm p-2 border border-neutral-300 rounded resize-none"
                rows={2}
                placeholder="Instrucciones especiales, detalles, etc."
                value={notes}
                onChange={handleNotesChange}
                onBlur={handleNotesSave}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Cart button component
interface CartButtonProps {
  variant?: 'ghost' | 'outline' | 'subtle' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export const CartButton = ({
  variant = 'ghost',
  size = 'md',
  showCount = true,
  className = '',
}: CartButtonProps) => {
  const { totalItems, openCart } = useCart();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={openCart}
      className={`relative ${className}`}
      aria-label="Carrito de servicios"
    >
      <ShoppingCart className={size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6'} />
      {showCount && totalItems > 0 && (
        <Badge 
          variant="danger" 
          size="sm" 
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center p-0"
        >
          {totalItems}
        </Badge>
      )}
    </Button>
  );
};

// Add to cart button component
interface AddToCartButtonProps {
  service: Service;
  variant?: 'ghost' | 'outline' | 'subtle' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  isFullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const AddToCartButton = ({
  service,
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  className = '',
  children,
}: AddToCartButtonProps) => {
  const { addItem } = useCart();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => addItem(service)}
      isFullWidth={isFullWidth}
      className={className}
    >
      {children || 'Agregar al carrito'}
    </Button>
  );
};

// Example usage component
export const ServiceCartExample = () => {
  // Sample services
  const services: Service[] = [
    {
      id: '1',
      name: 'Reparación de Plomería',
      price: 1200,
      description: 'Servicio de reparación de tuberías, grifos y sistemas de plomería.',
      category: 'Plomería',
    },
    {
      id: '2',
      name: 'Instalación Eléctrica',
      price: 1500,
      description: 'Instalación y reparación de sistemas eléctricos residenciales.',
      category: 'Electricidad',
    },
    {
      id: '3',
      name: 'Limpieza de Hogar',
      price: 800,
      description: 'Servicio completo de limpieza para hogares y apartamentos.',
      category: 'Limpieza',
    },
    {
      id: '4',
      name: 'Pintura Interior',
      price: 2500,
      description: 'Servicio de pintura para interiores con materiales incluidos.',
      category: 'Pintura',
    },
  ];

  return (
    <CartProvider>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Servicios Disponibles</h1>
          <CartButton />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="border border-neutral-200 rounded-lg p-4 bg-white">
              <h2 className="text-lg font-semibold">{service.name}</h2>
              <p className="text-sm text-neutral-600 mb-2">{service.category}</p>
              <p className="mb-4">{service.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">RD$ {service.price.toLocaleString()}</span>
                <AddToCartButton service={service} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </CartProvider>
  );
};