import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Button = ({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      'inline-flex items-center justify-center border-2 border-charcoal bg-accent px-4 py-2 font-semibold text-charcoal shadow-panel transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60',
      className
    )}
    {...props}
  />
);
