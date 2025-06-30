// src/types/Technician.ts
export interface Technician {
  id: string;
  name: string;
  specialties: string[];
  rating: number;
  photoUrl?: string;
  location: string;
}
