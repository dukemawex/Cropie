import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const severityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-severity-critical text-white';
    case 'high':
      return 'bg-severity-high text-white';
    case 'medium':
      return 'bg-severity-medium text-white';
    default:
      return 'bg-severity-low text-white';
  }
};
