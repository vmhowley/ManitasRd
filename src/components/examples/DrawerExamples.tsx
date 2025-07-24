import React from 'react';
import { 
  Drawer, 
  DrawerContent, 
  DrawerProvider, 
  DrawerTrigger, 
  useDrawer 
} from '../ui/Drawer';
import { Button } from '../ui/Button';
import { X, Settings, Info, HelpCircle, Filter, ShoppingCart } from 'lucide-react';

export const DrawerExamples = () => {
  return (
    <div className="p-8 space-y-12">
      <h1 className="text-3xl font-bold text-neutral-900">Ejemplos de Drawer</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <BasicDrawerExample />
        <PositionedDrawerExample />
        <SizedDrawerExample />
        <DrawerWithFormExample />
        <DrawerWithFooterExample />
        <ShoppingCartDrawerExample />
      </div>
    </div>
  );
};

// Ejemplo básico de Drawer
const BasicDrawerExample = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="border border-neutral-200 rounded-lg p-6 bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Drawer Básico</h2>
      <p className="text-neutral-600 mb-4">Un drawer simple con título y botón de cierre.</p>
      
      <Button onClick={() => setIsOpen(true)}>
        Abrir Drawer
      </Button>
      
      <Drawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        title="Drawer Básico"
      >
        <div className="space-y-4">
          <p>Este es un drawer básico con un título y un botón de cierre.</p>
          <p>Puedes añadir cualquier contenido aquí.</p>
        </div>
      </Drawer>
    </div>
  );
};

// Ejemplo de Drawer con diferentes posiciones
const PositionedDrawerExample = () => {
  const [position, setPosition] = React.useState<'left' | 'right' | 'top' | 'bottom'>('right');
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="border border-neutral-200 rounded-lg p-6 bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Posiciones</h2>
      <p className="text-neutral-600 mb-4">Drawer desde diferentes posiciones.</p>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button 
          variant="outline" 
          onClick={() => { setPosition('left'); setIsOpen(true); }}
        >
          Izquierda
        </Button>
        <Button 
          variant="outline" 
          onClick={() => { setPosition('right'); setIsOpen(true); }}
        >
          Derecha
        </Button>
        <Button 
          variant="outline" 
          onClick={() => { setPosition('top'); setIsOpen(true); }}
        >
          Arriba
        </Button>
        <Button 
          variant="outline" 
          onClick={() => { setPosition('bottom'); setIsOpen(true); }}
        >
          Abajo
        </Button>
      </div>
      
      <Drawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        position={position}
        title={`Drawer desde ${position === 'left' ? 'la izquierda' : position === 'right' ? 'la derecha' : position === 'top' ? 'arriba' : 'abajo'}`}
      >
        <p>Este drawer se abre desde {position === 'left' ? 'la izquierda' : position === 'right' ? 'la derecha' : position === 'top' ? 'arriba' : 'abajo'}.</p>
      </Drawer>
    </div>
  );
};

// Ejemplo de Drawer con diferentes tamaños
const SizedDrawerExample = () => {
  const [size, setSize] = React.useState<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md');
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="border border-neutral-200 rounded-lg p-6 bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Tamaños</h2>
      <p className="text-neutral-600 mb-4">Drawer con diferentes tamaños.</p>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button 
          variant="outline" 
          onClick={() => { setSize('sm'); setIsOpen(true); }}
        >
          Pequeño
        </Button>
        <Button 
          variant="outline" 
          onClick={() => { setSize('md'); setIsOpen(true); }}
        >
          Mediano
        </Button>
        <Button 
          variant="outline" 
          onClick={() => { setSize('lg'); setIsOpen(true); }}
        >
          Grande
        </Button>
        <Button 
          variant="outline" 
          onClick={() => { setSize('xl'); setIsOpen(true); }}
        >
          Extra Grande
        </Button>
        <Button 
          variant="outline" 
          className="col-span-2"
          onClick={() => { setSize('full'); setIsOpen(true); }}
        >
          Completo
        </Button>
      </div>
      
      <Drawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        size={size}
        title={`Drawer ${size === 'sm' ? 'Pequeño' : size === 'md' ? 'Mediano' : size === 'lg' ? 'Grande' : size === 'xl' ? 'Extra Grande' : 'Completo'}`}
      >
        <p>Este drawer tiene un tamaño {size === 'sm' ? 'pequeño' : size === 'md' ? 'mediano' : size === 'lg' ? 'grande' : size === 'xl' ? 'extra grande' : 'completo'}.</p>
      </Drawer>
    </div>
  );
};

// Ejemplo de Drawer con formulario
const DrawerWithFormExample = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="border border-neutral-200 rounded-lg p-6 bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Drawer con Formulario</h2>
      <p className="text-neutral-600 mb-4">Drawer que contiene un formulario.</p>
      
      <Button 
        leftIcon={<Settings className="h-4 w-4" />}
        onClick={() => setIsOpen(true)}
      >
        Configuración
      </Button>
      
      <Drawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        title="Configuración"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button onClick={() => setIsOpen(false)}>Guardar</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Notificaciones</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="email-notif" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded" />
                <label htmlFor="email-notif" className="ml-2 block text-sm text-neutral-700">Email</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="push-notif" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded" />
                <label htmlFor="push-notif" className="ml-2 block text-sm text-neutral-700">Push</label>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

// Ejemplo de Drawer con footer
const DrawerWithFooterExample = () => {
  return (
    <div className="border border-neutral-200 rounded-lg p-6 bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Drawer con Contexto</h2>
      <p className="text-neutral-600 mb-4">Usando DrawerProvider para gestionar el estado.</p>
      
      <DrawerProvider>
        <DrawerTrigger>
          <Button leftIcon={<Info className="h-4 w-4" />}>
            Información
          </Button>
        </DrawerTrigger>
        <DrawerContent 
          title="Información"
          footer={
            <div className="flex justify-end">
              <CloseButton />
            </div>
          }
        >
          <div className="space-y-4">
            <p>Este drawer utiliza el contexto de Drawer para gestionar su estado.</p>
            <p>Esto facilita la apertura y cierre desde diferentes componentes.</p>
          </div>
        </DrawerContent>
      </DrawerProvider>
    </div>
  );
};

// Botón de cierre que usa el contexto
const CloseButton = () => {
  const { close } = useDrawer();
  return (
    <Button onClick={close}>
      Entendido
    </Button>
  );
};

// Ejemplo de Drawer para carrito de compras
const ShoppingCartDrawerExample = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const cartItems = [
    { id: 1, name: 'Servicio de Plomería', price: 1200 },
    { id: 2, name: 'Reparación Eléctrica', price: 850 },
    { id: 3, name: 'Limpieza de Hogar', price: 1500 },
  ];
  
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);
  
  return (
    <div className="border border-neutral-200 rounded-lg p-6 bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Carrito de Servicios</h2>
      <p className="text-neutral-600 mb-4">Drawer para mostrar servicios seleccionados.</p>
      
      <Button 
        leftIcon={<ShoppingCart className="h-4 w-4" />}
        onClick={() => setIsOpen(true)}
      >
        Ver Carrito (3)
      </Button>
      
      <Drawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        position="right"
        size="md"
        title="Tu Carrito"
        footer={
          <div className="space-y-3 w-full">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>RD$ {total.toLocaleString()}</span>
            </div>
            <Button isFullWidth>Proceder al Pago</Button>
          </div>
        }
      >
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 border border-neutral-200 rounded-lg">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-neutral-600">RD$ {item.price.toLocaleString()}</p>
              </div>
              <Button variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
};