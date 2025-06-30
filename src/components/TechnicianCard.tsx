import React from "react";

interface Technician {
  name: string;
  location: string;
  rating: number;
  specialties: string[];
  photoUrl: string;
}

interface Props {
  technician: Technician;
}

export const TechnicianCard: React.FC<Props> = ({ technician }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full sm:w-72 hover:shadow-lg transition">
      <img
        src={technician.photoUrl}
        alt={technician.name}
        className="rounded w-full h-40 object-cover mb-3"
      />
      <h3 className="text-lg font-semibold">{technician.name}</h3>
      <p className="text-sm text-gray-600">{technician.location}</p>
      <p className="text-yellow-500 font-semibold">⭐ {technician.rating.toFixed(1)}</p>
      <p className="text-sm mt-1 text-gray-700">
        Especialidades: {technician.specialties.join(", ")}
      </p>
      <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        Solicitar Servicio
      </button>
    </div>
  );
};
