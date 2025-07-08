// src/types/User.ts
export type UserType = "client" | "technician";

import { Service } from '../services/standardService';

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
  hourlyRate?: number;
  avatar?: string;
  servicesOffered?: Array<{ service: Service; price: number }>;
}