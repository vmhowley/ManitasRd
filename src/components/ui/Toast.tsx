import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';

// Toast types
type ToastType = 'success' | 'error' | 'info' | 'warning';

// Toast position
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

// Toast interface
interface Toast {
  id: string;
  message: string | ReactNode;
  type: ToastType;
  duration?: number;
  onClose?: () => void;
  title?: string;
  action?: ReactNode;
}

// Toast context interface
interface ToastContextProps {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  position: ToastPosition;
  setPosition: (position: ToastPosition) => void;
  maxToasts: number;
  setMaxToasts: (max: number) => void;
}

// Create context with default values
const ToastContext = createContext<ToastContextProps>({
  toasts: [],
  addToast: () => '',
  removeToast: () => {},
  position: 'top-right',
  setPosition: () => {},
  maxToasts: 5,
  setMaxToasts: () => {},
});

// Toast provider props
interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
  defaultDuration?: number;
}

// Toast provider component
export function ToastProvider({
  children,
  position = 'top-right',
  maxToasts = 5,
  defaultDuration = 5000,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastPosition, setToastPosition] = useState<ToastPosition>(position);
  const [maxToastsCount, setMaxToastsCount] = useState<number>(maxToasts);

  // Add a new toast
  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = {
        ...toast,
        id,
        duration: toast.duration || defaultDuration,
      };

      setToasts((prevToasts) => {
        // If we're at max capacity, remove the oldest toast
        if (prevToasts.length >= maxToastsCount) {
          return [...prevToasts.slice(1), newToast];
        }
        return [...prevToasts, newToast];
      });

      return id;
    },
    [maxToastsCount, defaultDuration]
  );

  // Remove a toast by ID
  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Set toast position
  const setPosition = useCallback((newPosition: ToastPosition) => {
    setToastPosition(newPosition);
  }, []);

  // Set max toasts
  const setMaxToasts = useCallback((max: number) => {
    setMaxToastsCount(max);
  }, []);

  // Context value
  const contextValue = {
    toasts,
    addToast,
    removeToast,
    position: toastPosition,
    setPosition,
    maxToasts: maxToastsCount,
    setMaxToasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// Hook to use toast context
export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  const { addToast, removeToast, position, setPosition, maxToasts, setMaxToasts } = context;
  
  // Helper functions for different toast types
  const success = useCallback(
    (message: string | ReactNode, options?: Omit<Toast, 'id' | 'message' | 'type'>) => {
      return addToast({ message, type: 'success', ...options });
    },
    [addToast]
  );
  
  const error = useCallback(
    (message: string | ReactNode, options?: Omit<Toast, 'id' | 'message' | 'type'>) => {
      return addToast({ message, type: 'error', ...options });
    },
    [addToast]
  );
  
  const info = useCallback(
    (message: string | ReactNode, options?: Omit<Toast, 'id' | 'message' | 'type'>) => {
      return addToast({ message, type: 'info', ...options });
    },
    [addToast]
  );
  
  const warning = useCallback(
    (message: string | ReactNode, options?: Omit<Toast, 'id' | 'message' | 'type'>) => {
      return addToast({ message, type: 'warning', ...options });
    },
    [addToast]
  );
  
  const custom = useCallback(
    (options: Omit<Toast, 'id'>) => {
      return addToast(options);
    },
    [addToast]
  );
  
  return {
    success,
    error,
    info,
    warning,
    custom,
    dismiss: removeToast,
    position,
    setPosition,
    maxToasts,
    setMaxToasts,
  };
}

// Toast container component
function ToastContainer() {
  const { toasts, position, removeToast } = useContext(ToastContext);
  
  // Create portal only on client side
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  if (!mounted) return null;
  
  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4 flex-col',
    'top-left': 'top-4 left-4 flex-col',
    'bottom-right': 'bottom-4 right-4 flex-col-reverse',
    'bottom-left': 'bottom-4 left-4 flex-col-reverse',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 flex-col',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse',
  };
  
  return createPortal(
    <div
      className={`fixed z-50 flex gap-3 ${positionClasses[position]}`}
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>,
    document.body
  );
}

// Toast item props
interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

// Toast item component
function ToastItem({ toast, onClose }: ToastItemProps) {
  const { message, type, duration, title, action, onClose: toastOnClose } = toast;
  
  // Auto-dismiss after duration
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
        toastOnClose?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose, toastOnClose]);
  
  // Handle close button click
  const handleClose = () => {
    onClose();
    toastOnClose?.();
  };
  
  // Type-specific styles and icons
  const typeStyles = {
    success: 'bg-success-50 border-success-500 text-success-700',
    error: 'bg-error-50 border-error-500 text-error-700',
    info: 'bg-info-50 border-info-500 text-info-700',
    warning: 'bg-warning-50 border-warning-500 text-warning-700',
  };
  
  const TypeIcon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  }[type];
  
  const iconColors = {
    success: 'text-success-500',
    error: 'text-error-500',
    info: 'text-info-500',
    warning: 'text-warning-500',
  };
  
  return (
    <div
      className={`
        flex w-full max-w-sm items-start gap-3 rounded-lg border-l-4 p-4 shadow-md
        animate-in slide-in-from-right-5 fade-in duration-300
        ${typeStyles[type]}
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className={`shrink-0 ${iconColors[type]}`}>
        <TypeIcon size={20} />
      </div>
      
      <div className="flex-1 space-y-1">
        {title && <h3 className="font-medium">{title}</h3>}
        <div className="text-sm">{message}</div>
        {action && <div className="mt-2">{action}</div>}
      </div>
      
      <button
        onClick={handleClose}
        className="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-500"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

// Export individual components
export { ToastContext, ToastContainer };