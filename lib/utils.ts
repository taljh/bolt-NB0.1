import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as Saudi Riyal currency
 * @param amount - The amount to format
 * @returns Formatted currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR' }).format(amount);
}
