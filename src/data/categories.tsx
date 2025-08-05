import { Wrench, Zap, Droplets, Paintbrush, Scissors, Car, Home as HomeIcon, Wifi } from 'lucide-react';



export const categories = [
  {
    name: "Reparaciones",
    icon: Wrench,
    color: "text-green-500",
    path: "/services/repairs",
  },
  {
    name: "Plomería",
    icon: Droplets,
    color: "text-blue-500",
    path: "/services/plumbing",
  },
  { name: "Electricidad", icon: Zap, color: "text-yellow-500", path: "/services/electricity" },
  { name: "Pintura", icon: Paintbrush, color: "text-purple-500",  path: "/services/electricity" },
  { name: "Belleza", icon: Scissors, color: "text-pink-500",  path: "/services/electricity" },
  { name: "Automotriz", icon: Car, color: "text-red-500",  path: "/services/electricity" },
  { name: "Limpieza", icon: HomeIcon, color: "text-teal-500",  path: "/services/electricity" },
  { name: "Tecnología", icon: Wifi, color: "text-indigo-600",  path: "/services/electricity" },
];
