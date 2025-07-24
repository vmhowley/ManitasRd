import React, { createContext, useContext, useState, useCallback } from 'react';
import { XCircle, CheckCircle, Info, AlertTriangle, Bell, Clock, ShieldCheck } from 'lucide-react';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'notification' | 'pending' | 'security';
  title?: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  onAction?: () => void;
  actionLabel?: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastMessage['type'], options?: Partial<Omit<ToastMessage, 'id' | 'message' | 'type'>>) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info', options?: Partial<Omit<ToastMessage, 'id' | 'message' | 'type'>>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = options?.duration || 5000; // Default 5 seconds
    
    setToasts((prevToasts) => [
      ...prevToasts, 
      { 
        id, 
        message, 
        type, 
        position: options?.position || 'bottom-right',
        title: options?.title,
        onAction: options?.onAction,
        actionLabel: options?.actionLabel,
        duration
      }
    ]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);
  }, []);
  
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const getIcon = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <XCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'notification':
        return <Bell className="h-5 w-5" />;
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'security':
        return <ShieldCheck className="h-5 w-5" />;
      case 'info':
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getColors = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return 'bg-success text-white';
      case 'error':
        return 'bg-error text-white';
      case 'warning':
        return 'bg-warning text-gray-900';
      case 'notification':
        return 'bg-accent-500 text-white';
      case 'pending':
        return 'bg-neutral-500 text-white';
      case 'security':
        return 'bg-secondary-600 text-white';
      case 'info':
      default:
        return 'bg-info text-white';
    }
  };

  // Función para obtener la posición del toast
  const getPositionClasses = (position: ToastMessage['position']) => {
    switch (position) {
      case 'top-right':
        return 'fixed top-4 right-4';
      case 'top-left':
        return 'fixed top-4 left-4';
      case 'bottom-left':
        return 'fixed bottom-4 left-4';
      case 'top-center':
        return 'fixed top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'fixed bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
      default:
        return 'fixed bottom-4 right-4';
    }
  };

  // Agrupar toasts por posición
  const groupedToasts = toasts.reduce<Record<string, ToastMessage[]>>((acc, toast) => {
    const position = toast.position || 'bottom-right';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {});

  return (
    <ToastContext.Provider value={{ showToast, clearToasts }}>
      {children}
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <div key={position} className={`${getPositionClasses(position as ToastMessage['position'])} z-50 space-y-2`}>
          {positionToasts.map((toast) => (
            <div
              key={toast.id}
              className={`flex flex-col w-80 p-4 rounded-lg shadow-lg animate-fade-in ${getColors(toast.type)}`}
              role="alert"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  {getIcon(toast.type)}
                </div>
                {toast.title && (
                  <div className="font-semibold">
                    {toast.title}
                  </div>
                )}
                <button
                  onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                  className="ml-auto -mx-1.5 -my-1.5 bg-transparent rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 hover:bg-opacity-20 hover:bg-black"
                  aria-label="Close"
                >
                  <span className="sr-only">Close</span>
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
              <div className="text-sm mt-1">
                {toast.message}
              </div>
              {toast.onAction && toast.actionLabel && (
                <button
                  onClick={() => {
                    toast.onAction?.();
                    setToasts((prev) => prev.filter((t) => t.id !== toast.id));
                  }}
                  className="mt-2 px-3 py-1 text-sm font-medium bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md self-end"
                >
                  {toast.actionLabel}
                </button>
              )}
            </div>
          ))}
        </div>
      ))}
    </ToastContext.Provider>
  );
};
