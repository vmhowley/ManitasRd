import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home,  Calendar, MessageSquare, User } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
interface NavItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 py-2 ${isActive ? 'text-primary-700  dark:text-primary-300 border-t-2' : 'text-neutral-700 dark:text-neutral-300'}`}
      aria-label={`Navegar a ${label}`}
    >
      <Icon className={`h-5 w-5 ${isActive ? 'text-primary-700 dark:text-primary-300 ' : 'text-neutral-600 dark:text-neutral-400'}`} />
      <span className="text-xs mt-1 font-medium">{label}</span>
    </button>
  );
};

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: "Inicio", path: "/" },
    {
      icon: Calendar,
      label: user?.type === "client" ? "Citas" : "Agenda",
      path: `${
        user?.type === "client" ? "/booking" : "/technician-dashboard"
      }`,
    },
    { icon: MessageSquare, label: "Mensajes", path: "/messaging" },
    { icon: User, label: "Perfil", path: "/profile" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 pb-4 left-0 right-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border-t border-neutral-200 dark:border-neutral-800 shadow-lg z-50">
      <div className="flex justify-between items-center px-4 py-1 text-center">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isActive={currentPath === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
    </div>
  );
};