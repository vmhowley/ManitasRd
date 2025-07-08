import type { User } from './User';

export interface Technician extends User {
  image?: string;
  verified?: boolean;
  specialty?: string;
  reviews?: number;
  distance?: string;
  price?: string;
}