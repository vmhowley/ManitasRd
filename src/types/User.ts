// src/types/User.ts
export type UserType = "client" | "technician";

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  phone?: string;
  address?: string;
  specialties?: string[];
  rating?: number;
  photo?: string;
}