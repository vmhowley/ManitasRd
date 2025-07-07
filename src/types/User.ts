// src/types/User.ts
export type UserType = "client" | "technician";

export interface User {
  _id: string;
  name: string;
  email: string;
  type: UserType;
  phone?: string;
  address?: string;
  rating?: number;
  specialties?: string[];
  avatar?: string;
}