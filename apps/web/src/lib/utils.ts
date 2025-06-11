import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getOrgUrl(orgSlug: string, path: string): string {
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `/org/${orgSlug}/${cleanPath}`;
}
