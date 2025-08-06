import { useAuth } from "../context/AuthContext";
import {
  SquarePen,
  ChevronRight,
  Lock,
  ClipboardList,
  MapPin,
  Eye,
  LogOut as LogOutIcon, ShieldCheck
} from "lucide-react";
import { Link } from "react-router-dom";

export const Profile = () => {
  const { user, logout } = useAuth();
  const navLinks = [
    { title: "Editar Perfil", path: "/edit-profile", icon: <SquarePen /> },
    { title: "Cambiar Contraceña", path: "/account", icon: <Lock /> },
    { title: "Mis Reservas", path: "/reservations", icon: <ClipboardList /> },
    { title: "Mi Ubicación", path: "/location", icon: <MapPin /> },
    { title: "Dark Mode", path: "", icon: <Eye /> },
    {title: "Politica de Privacidad", path: "/change-password", icon: <ShieldCheck />},
    {title: "Terminos y Condiciones", path: "/change-password", icon: <ClipboardList /> },
  ];
  if (!user){
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="font-bold">No estas autenticado</h1>
        <Link to="/login" className="text-blue-500">
          Iniciar Sesión
        </Link>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center  min-h-screen gap-4">
      <div className="flex flex-col items-center justify-center gap-2">
        <img
          className="w-20 h-20 rounded-md"
          src={`https://ui-avatars.com/api/?name=${user?.name}&background=0D8ABC&color=fff&size=128`}
          alt=""
        />
        <h1 className="font-bold">{user?.name}</h1>
        <h1 className="font-bold">{user?.email}</h1>
      </div>

      <div className="divide-y divide-border text-center font-semibold">
        {navLinks.map((link) => (
          <div key={link.title} className="flex items-center w-screen p-4">
            <Link
              to={link.path}
              className="flex items-center justify-between gap-2 w-full"
            >
              <div className="flex items-center gap-2">
                {link.icon}
                <h1>{link.title}</h1>
              </div>
              <ChevronRight />
            </Link>
          </div>
        ))}
        <div className="flex items-center w-screen p-4">
          <button
            onClick={logout}
            className="flex items-center justify-between gap-2 w-full text-red-500"
          >
            <div className="flex items-center gap-2">
              <LogOutIcon />
              <h1 className="">Cerrar Sesión</h1>
            </div>
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};
