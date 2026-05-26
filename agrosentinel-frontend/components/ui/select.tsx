import { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Select = ({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select className={cn('w-full border-2 border-charcoal bg-white px-3 py-2 outline-none focus:border-primary', className)} {...props} />
);
