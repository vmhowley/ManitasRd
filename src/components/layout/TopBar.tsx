import { useState } from 'react';
import { Menu, MessageSquare, User as UserIcon, Wrench, Zap, Home as HomeIcon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import { Button } from '../ui/Button';
import { DrawerContent, DrawerProvider, DrawerTrigger } from '../ui/Drawer';
import { NotificationsDrawer } from '../NotificationsDrawer';

export const TopBar = () => {
  const isMobile = window.innerWidth < 768; // Detect if the device is mobile
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Notificaciones reales del sistema
  interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'info' | 'success' | 'warning' | 'error';
  }
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const navLinks = [
    { name: 'Servicios', path: '/#services', icon: Wrench },
    { name: 'Cómo Funciona', path: '/how-it-works', icon: Zap },
    { name: 'Técnicos', path: '/#technicians', icon: UserIcon },
    { name: 'Ejemplos', path: '/examples', icon: HomeIcon },
  ];

  const renderAuthButtons = () => (
    <div className={`flex ${isMobile ? 'flex-col w-full space-y-4' : 'items-center space-x-4'}`}>
      {user ? (
        <>
          <Button
            variant="ghost"
            size={isMobile ? 'lg' : 'md'}
            leftIcon={<MessageSquare className="h-5 w-5" />}
            onClick={() => navigate('/messaging')}
            className={isMobile ? 'justify-center' : ''}
          >
            Mensajes
          </Button>
          <Button
            variant="ghost"
            size={isMobile ? 'lg' : 'md'}
            leftIcon={<UserIcon className="h-5 w-5" />}
            onClick={() => navigate(user.type === 'client' ? '/client-dashboard' : '/technician-home')}
            className={isMobile ? 'justify-center' : ''}
          >
            Mi Perfil
          </Button>
          <Button
            variant="danger"
            size={isMobile ? 'lg' : 'md'}
            onClick={logout}
            isFullWidth={isMobile}
            className={isMobile ? 'mt-2' : ''}
          >
            Cerrar Sesión
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            size={isMobile ? 'lg' : 'md'}
            onClick={() => navigate('/login')}
            isFullWidth={isMobile}
          >
            Iniciar Sesión
          </Button>
          <Button
            variant="primary"
            size={isMobile ? 'lg' : 'md'}
            onClick={() => navigate('/register')}
            isFullWidth={isMobile}
          >
            Regístrate
          </Button>
        </>
      )}
    </div>
  );

  return (
    <header className="fixed w-screen top-0 left-0 right-0 z-50 shadow-lg text-neutral-800 backdrop-blur-sm bg-white/95 dark:bg-neutral-900/95 border-b border-neutral-200 dark:border-neutral-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img src={logo} alt="SolucionaRd Logo" className="h-10 w-auto transition-transform group-hover:scale-110 duration-300" />
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">SolucionaRd</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.path} 
                className="flex items-center font-medium text-neutral-800 dark:text-neutral-200 hover:text-primary-700 dark:hover:text-primary-300 transition-colors relative group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 rounded-md p-2"
                aria-label={`Ir a ${link.name}`}
              >
                <link.icon className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-300 group-hover:text-primary-700 dark:group-hover:text-primary-200" />
                <span className="relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary-600 dark:after:bg-primary-300 after:transition-all group-hover:after:w-full">
                  {link.name}
                </span>
              </a>
            ))}
          </nav>

          {/* Desktop Auth Buttons and Notifications */}
          <div className="hidden md:flex items-center">
            {user && (
              <NotificationsDrawer
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDelete={handleDelete}
                onClearAll={handleClearAll}
              />
            )}
            {renderAuthButtons()}
          </div>

          {/* Mobile Menu Button */}
          <DrawerProvider>
            <DrawerTrigger>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden z-50 p-2 rounded-full"
                aria-label="Abrir menú"
              >
                <Menu className="h-7 w-7" />
              </Button>
            </DrawerTrigger>
            <DrawerContent position="top" size="sm" className="rounded">
              <div className="flex flex-col items-start space-y-6 p-6 ">
                <Link to="/" className="flex items-center space-x-2 group mb-6 self-center">
                  <img src={logo} alt="SolucionaRd Logo" className="h-10 w-auto" />
                  {/* <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">SolucionaRd</span> */}
                </Link>
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    className="flex items-center w-full text-lg font-medium text-neutral-800 dark:text-neutral-200 hover:text-primary-700 dark:hover:text-primary-300 transition-colors p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-700/70 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
                    aria-label={`Ir a ${link.name}`}
                  >
                    <link.icon className="h-6 w-6 mr-3 text-primary-600 dark:text-primary-300" />
                    {link.name}
                  </a>
                ))}
                <div className="pt-8 border-t border-neutral-200 dark:border-neutral-700 w-full flex flex-col items-center mt-4">
                  {renderAuthButtons()}
                </div>
              </div>
            </DrawerContent>
          </DrawerProvider>
        </div>
      </div>
    </header>
  );
};

