import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind de manera eficiente, evitando conflictos
 * Utiliza clsx para combinar clases condicionales y twMerge para resolver conflictos
 * 
 * @param inputs - Clases CSS, objetos condicionales o arrays
 * @returns String con las clases combinadas y optimizadas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}