import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home,  Calendar, MessageSquare, User, LayoutDashboard } from 'lucide-react';
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
      className={`flex flex-col items-center justify-center flex-1 py-2 ${isActive ? 'dark:text-white' : 'dark:text-neutral-400'}`}
    >
      <Icon className={`h-5 w-5 ${isActive ? 'dark:text-white' : 'dark:text-neutral-400'}`} />
      <span className="text-xs mt-1">{label}</span>
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
    { icon: LayoutDashboard, label: "Categorias", path: "/categories" },
    {
      icon: Calendar,
      label: "Reservaciones",
      path: `${
        user?.type === "client" ? "/client-dashboard" : "/technician-dashboard"
      }`,
    },
    { icon: MessageSquare, label: "Chat", path: "/messaging" },
    { icon: User, label: "Perfil", path: "/profile" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-3xl border-t border-neutral-600 z-50">
      <div className="flex justify-between items-center px-4 text-center ">
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