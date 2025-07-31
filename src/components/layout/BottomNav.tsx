import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calculator, Calendar, MessageSquare, User } from 'lucide-react';

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
      className={`flex flex-col items-center justify-center flex-1 py-2 ${isActive ? 'text-white' : 'text-neutral-400'}`}
    >
      <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { icon: Home, label: "Inicio", path: "/" },
    { icon: Calendar, label: "Servicios", path: "/client-dashboard" },
    { icon: Calculator, label: "Calculador", path: "/request-service" },
    { icon: MessageSquare, label: "Chat", path: "/messaging" },
    { icon: User, label: "Perfil", path: "/edit-profile" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-900/70 backdrop-blur-3xl border-t border-neutral-600 z-50">
      <div className="flex justify-between">
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