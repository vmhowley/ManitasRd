// src/types/User.ts
import type { Service } from './Service';

export type UserType = "client" | "technician";

export interface User {
  id: string;
  _id: string;
  uid: string;
  name:string;
  email: string;
  type: UserType;
  phone?: string;
  address?: string;
  rating?: number;
  specialties?: string[];
  hourlyRate?: number;
  avatar?: string;
  servicesOffered?: Array<{ service: Service; price: number }>;
  location?: string; 
}

export interface TechnicianUpdatePayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  specialties?: string[];
  hourlyRate?: number;
  servicesOffered?: Array<{ service: string; price: number }>;
  avatar?: string;
}
