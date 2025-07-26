import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  MessageSquare,
  Settings,
  User,
  FileText,
  Wrench,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { DrawerContent, DrawerProvider, DrawerTrigger } from '../ui/Drawer';
import { Button } from '../ui/Button';

interface SideNavProps {
  children?: React.ReactNode;
}

export const SideNav = ({ children }: SideNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  const isClient = user.type === 'client';
  
  const navItems = isClient 
    ? [
        { name: 'Dashboard', path: '/client-dashboard', icon: <Home className="h-5 w-5" /> },
        { name: 'Solicitudes', path: '/client-requests', icon: <FileText className="h-5 w-5" /> },
        { name: 'Mensajes', path: '/messaging', icon: <MessageSquare className="h-5 w-5" /> },
        { name: 'Mi Perfil', path: '/client-profile', icon: <User className="h-5 w-5" /> },
        { name: 'Configuración', path: '/settings', icon: <Settings className="h-5 w-5" /> },
      ]
    : [
        { name: 'Inicio', path: '/technician-home', icon: <Home className="h-5 w-5" /> },
        { name: 'Solicitudes', path: '/available-requests', icon: <FileText className="h-5 w-5" /> },
        { name: 'Mis Servicios', path: '/technician-services', icon: <Wrench className="h-5 w-5" /> },
        { name: 'Mensajes', path: '/messaging', icon: <MessageSquare className="h-5 w-5" /> },
        { name: 'Mi Perfil', path: '/technician-profile', icon: <User className="h-5 w-5" /> },
        { name: 'Configuración', path: '/settings', icon: <Settings className="h-5 w-5" /> },
      ];

  const isActive = (path: string) => location.pathname === path;

  const renderNavItems = () => (
    <div className="flex flex-col space-y-1 w-full">
      {navItems.map((item) => (
        <Button
          key={item.path}
          variant={isActive(item.path) ? 'subtle' : 'ghost'}
          size="lg"
          leftIcon={item.icon}
          onClick={() => navigate(item.path)}
          className={`justify-start ${isActive(item.path) ? 'bg-primary-50 text-primary-700' : ''}`}
        >
          {item.name}
        </Button>
      ))}
      <div className="pt-4 mt-4 border-t border-neutral-200">
        <Button
          variant="ghost"
          size="lg"
          leftIcon={<LogOut className="h-5 w-5" />}
          onClick={logout}
          className="justify-start text-danger-600 hover:text-danger-700 hover:bg-danger-50"
        >
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );

  // Desktop sidebar
  const DesktopSidebar = () => (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-neutral-200 h-screen sticky top-0 p-4">
      <div className="flex flex-col h-full">
        <div className="text-xl font-bold text-primary-600 mb-6 px-2">
          {isClient ? 'Panel de Cliente' : 'Panel de Técnico'}
        </div>
        {renderNavItems()}
      </div>
    </div>
  );

  // Mobile drawer
  const MobileDrawer = () => (
    <div className="md:hidden">
      <DrawerProvider>
        <DrawerTrigger>
          <Button
            variant="subtle"
            size="sm"
            className="mb-4"
            leftIcon={<ChevronRight className="h-5 w-5" />}
          >
            Menú
          </Button>
        </DrawerTrigger>
        <DrawerContent position="left" size="sm" title={isClient ? 'Panel de Cliente' : 'Panel de Técnico'}>
          <div className="flex flex-col h-full">
            {renderNavItems()}
          </div>
        </DrawerContent>
      </DrawerProvider>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <DesktopSidebar />
      <div className="flex-1">
        <div className="p-4">
          <MobileDrawer />
          {children}
        </div>
      </div>
    </div>
  );
};