import { useState } from 'react';
import { Menu, MessageSquare, User as UserIcon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import { Button } from '../ui/Button';
import { Drawer, DrawerContent, DrawerProvider, DrawerTrigger } from '../ui/Drawer';
import { NotificationsDrawer } from '../NotificationsDrawer';

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Notificaciones reales del sistema
  const [notifications, setNotifications] = useState([]);

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
    { name: 'Servicios', path: '/#services' },
    { name: 'Cómo Funciona', path: '/how-it-works' },
    { name: 'Técnicos', path: '/#technicians' },
    { name: 'Ejemplos', path: '/examples' },
  ];

  const renderAuthButtons = (isMobile = false) => (
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
            onClick={() => navigate(user.type === 'client' ? '/client-dashboard' : '/technician-dashboard')}
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
    <header className="sticky top-0 left-0 right-0 z-50 bg-white shadow-md text-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img src={logo} alt="ManitasRD Logo" className="h-8 w-auto transition-transform group-hover:scale-110 duration-300" />
            <span className="text-2xl font-bold text-primary-600">ManitasRD</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.path} 
                className="font-semibold text-neutral-700 hover:text-primary-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary-600 after:transition-all hover:after:w-full"
              >
                {link.name}
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
                className="md:hidden z-50 p-2"
                aria-label="Abrir menú"
              >
                <Menu className="h-7 w-7" />
              </Button>
            </DrawerTrigger>
            <DrawerContent position="left" size="sm">
              <div className="flex flex-col items-center space-y-6 p-4 pt-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    className="text-xl font-semibold text-neutral-700 hover:text-primary-600 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-6 border-t border-neutral-200 w-full flex flex-col items-center">
                  {renderAuthButtons(true)}
                </div>
              </div>
            </DrawerContent>
          </DrawerProvider>
        </div>
      </div>

      {/* Mobile Navigation is now handled by the Drawer component */}
    </header>
  );
};

