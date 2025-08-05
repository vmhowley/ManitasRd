import React from 'react'
import { useAuth } from '../context/AuthContext'
import {
  SquarePen,
  ChevronRight,
  Lock,
  ClipboardList,
  MapPin,
  Eye,
  LogOut as LogOutIcon,
} from "lucide-react";


export const Profile = () => {
    const { user, logout } = useAuth();
    
    console.log(user)
  return (
    <div className="flex flex-col items-center  min-h-screen gap-4">
      <img
        className="w-20 h-20 rounded-md"
        src={`https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff&size=128`}
        alt=""
      />
      <div className="divide-y divide-gray-800 text-center text-gray-400 font-bold">
        <div className="flex items-center w-screen p-4">
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
              <SquarePen />
              <h1 className="">Editar perfil</h1>
            </div>
            <ChevronRight />
          </div>
        </div>
        <div className="flex items-center w-screen p-4">
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
              <Lock />
              <h1 className="">Cambiar contraseña</h1>
            </div>
            <ChevronRight />
          </div>
        </div>
        <div className="flex items-center w-screen p-4">
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
              <ClipboardList />
              <h1 className="">Mis reservas</h1>
            </div>
            <ChevronRight />
          </div>
        </div>
        <div className="flex items-center w-screen p-4">
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
              <MapPin />
              <h1 className="">Mis Direcciones</h1>
            </div>
            <ChevronRight />
          </div>
        </div>
        <div className="flex items-center w-screen p-4">
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
              <Eye />
              <h1 className="">Modo Oscuro</h1>
            </div>
            <ChevronRight />
          </div>
        </div>
        <div className="flex items-center w-screen p-4">
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
              <SquarePen />
              <h1 className="">Politicas de privacidad</h1>
            </div>
            <ChevronRight />
          </div>
        </div>
        <div className="flex items-center w-screen p-4">
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
              <SquarePen />
              <h1 className="">Terminos y condiciones</h1>
            </div>
            <ChevronRight />
          </div>
        </div>
        <div className="flex items-center w-screen p-4">
          <div className="flex items-center justify-between gap-2 w-full">
            <button 
            className="flex items-center gap-2"
             onClick={logout} 
            >
              <LogOutIcon />
              <h1 className="text-danger-700">Cerrar sesion</h1>
            </button>
            <ChevronRight />
          </div>
        </div>
      </div>
    </div>
  );
}
