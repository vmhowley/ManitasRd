import React, { createContext, useContext, useState } from 'react';
import { HelpCircle, ExternalLink } from 'lucide-react';
import { Drawer } from './ui/Drawer';
import { Button } from './ui/Button';

// Define the help content type
interface HelpContent {
  title: string;
  content: React.ReactNode;
  links?: Array<{
    text: string;
    url: string;
  }>;
}

// Define the context type
interface HelpContextType {
  openHelp: (sectionId: string) => void;
  closeHelp: () => void;
  isHelpOpen: boolean;
  currentHelpSection: string | null;
}

// Create the context
const HelpContext = createContext<HelpContextType | undefined>(undefined);

// Help content mapping
const helpContentMap: Record<string, HelpContent> = {
  'dashboard': {
    title: 'Panel de Control',
    content: (
      <div className="space-y-4">
        <p>
          Bienvenido a tu Panel de Control. Aquí puedes ver un resumen de tus actividades recientes,
          solicitudes pendientes y mensajes nuevos.
        </p>
        <h3 className="font-medium text-lg">Características principales:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Vista general de tus solicitudes activas</li>
          <li>Acceso rápido a mensajes recientes</li>
          <li>Estadísticas de uso del servicio</li>
          <li>Notificaciones importantes</li>
        </ul>
      </div>
    ),
    links: [
      { text: 'Guía completa del panel', url: '/help/dashboard-guide' },
      { text: 'Video tutorial', url: '/tutorials/dashboard' },
    ],
  },
  'service-request': {
    title: 'Solicitud de Servicio',
    content: (
      <div className="space-y-4">
        <p>
          En esta sección puedes solicitar un nuevo servicio. Completa el formulario con los detalles
          de tu solicitud para que nuestros técnicos puedan ayudarte.
        </p>
        <h3 className="font-medium text-lg">Cómo solicitar un servicio:</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Selecciona la categoría de servicio que necesitas</li>
          <li>Describe el problema o trabajo a realizar</li>
          <li>Adjunta fotos si es necesario</li>
          <li>Selecciona la fecha y hora preferida</li>
          <li>Revisa y envía tu solicitud</li>
        </ol>
        <div className="bg-info-50 p-3 rounded-md border border-info-200 text-info-800">
          <strong>Consejo:</strong> Mientras más detalles proporciones, más precisa será la cotización.
        </div>
      </div>
    ),
    links: [
      { text: 'Precios de referencia', url: '/pricing' },
      { text: 'Preguntas frecuentes', url: '/faq' },
    ],
  },
  'messaging': {
    title: 'Sistema de Mensajería',
    content: (
      <div className="space-y-4">
        <p>
          Nuestro sistema de mensajería te permite comunicarte directamente con los técnicos
          o con el soporte al cliente para resolver cualquier duda.
        </p>
        <h3 className="font-medium text-lg">Funcionalidades:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Conversaciones en tiempo real</li>
          <li>Envío de imágenes y archivos</li>
          <li>Historial completo de conversaciones</li>
          <li>Notificaciones de nuevos mensajes</li>
        </ul>
        <div className="bg-warning-50 p-3 rounded-md border border-warning-200 text-warning-800">
          <strong>Nota:</strong> Los técnicos suelen responder en un plazo máximo de 2 horas durante el horario laboral.
        </div>
      </div>
    ),
  },
  'profile': {
    title: 'Gestión de Perfil',
    content: (
      <div className="space-y-4">
        <p>
          En tu perfil puedes gestionar tu información personal, preferencias y métodos de pago.
          Mantener tu perfil actualizado nos ayuda a brindarte un mejor servicio.
        </p>
        <h3 className="font-medium text-lg">Secciones del perfil:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Información personal:</strong> Nombre, dirección, teléfono</li>
          <li><strong>Preferencias:</strong> Notificaciones, idioma, zona horaria</li>
          <li><strong>Seguridad:</strong> Cambio de contraseña, autenticación de dos factores</li>
          <li><strong>Métodos de pago:</strong> Tarjetas, cuentas bancarias</li>
        </ul>
      </div>
    ),
    links: [
      { text: 'Política de privacidad', url: '/privacy-policy' },
      { text: 'Términos de servicio', url: '/terms' },
    ],
  },
};

// Provider component
interface HelpProviderProps {
  children: React.ReactNode;
}

export const HelpProvider = ({ children }: HelpProviderProps) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [currentHelpSection, setCurrentHelpSection] = useState<string | null>(null);

  const openHelp = (sectionId: string) => {
    if (helpContentMap[sectionId]) {
      setCurrentHelpSection(sectionId);
      setIsHelpOpen(true);
    } else {
      console.warn(`Help content for section "${sectionId}" not found`);
    }
  };

  const closeHelp = () => {
    setIsHelpOpen(false);
  };

  return (
    <HelpContext.Provider value={{ openHelp, closeHelp, isHelpOpen, currentHelpSection }}>
      {children}
      
      {/* Help Drawer */}
      {currentHelpSection && (
        <Drawer
          isOpen={isHelpOpen}
          onClose={closeHelp}
          position="right"
          size="md"
          title={helpContentMap[currentHelpSection].title}
          showCloseButton={true}
        >
          <div className="space-y-6">
            {/* Help content */}
            <div>
              {helpContentMap[currentHelpSection].content}
            </div>
            
            {/* Help links */}
            {helpContentMap[currentHelpSection].links && helpContentMap[currentHelpSection].links!.length > 0 && (
              <div className="border-t border-neutral-200 pt-4 mt-4">
                <h3 className="font-medium mb-2">Recursos adicionales:</h3>
                <ul className="space-y-2">
                  {helpContentMap[currentHelpSection].links!.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.url} 
                        className="text-primary-600 hover:text-primary-700 flex items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Drawer>
      )}
    </HelpContext.Provider>
  );
};

// Hook to use the help context
export const useHelp = () => {
  const context = useContext(HelpContext);
  if (context === undefined) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
};

// Help button component
interface HelpButtonProps {
  sectionId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'outline' | 'subtle';
  label?: string;
  className?: string;
}

export const HelpButton = ({
  sectionId,
  size = 'sm',
  variant = 'ghost',
  label,
  className = '',
}: HelpButtonProps) => {
  const { openHelp } = useHelp();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => openHelp(sectionId)}
      className={`text-neutral-500 hover:text-primary-600 ${className}`}
      aria-label={label || 'Ayuda'}
    >
      <HelpCircle className={size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6'} />
      {label && <span className="ml-2">{label}</span>}
    </Button>
  );
};

// Example usage component
export const HelpDrawerExample = () => {
  return (
    <HelpProvider>
      <div className="p-6 space-y-8">
        <h1 className="text-2xl font-bold">Ejemplo de Ayuda Contextual</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-neutral-200 rounded-lg p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Panel de Control</h2>
              <HelpButton sectionId="dashboard" />
            </div>
            <p className="text-neutral-600">
              Contenido del panel de control...
            </p>
          </div>
          
          <div className="border border-neutral-200 rounded-lg p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Solicitud de Servicio</h2>
              <HelpButton sectionId="service-request" />
            </div>
            <p className="text-neutral-600">
              Formulario de solicitud de servicio...
            </p>
          </div>
          
          <div className="border border-neutral-200 rounded-lg p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Mensajería</h2>
              <HelpButton sectionId="messaging" label="Ayuda con mensajes" variant="outline" />
            </div>
            <p className="text-neutral-600">
              Sistema de mensajería...
            </p>
          </div>
          
          <div className="border border-neutral-200 rounded-lg p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Mi Perfil</h2>
              <HelpButton sectionId="profile" />
            </div>
            <p className="text-neutral-600">
              Gestión de perfil de usuario...
            </p>
          </div>
        </div>
      </div>
    </HelpProvider>
  );
};