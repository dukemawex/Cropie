import { HTMLAttributes } from 'react';
import { cn, severityColor } from '@/lib/utils';

export const Badge = ({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) => {
  const severity = String(children || '').toLowerCase();
  return (
    <span
      className={cn('inline-flex rounded-none border-2 border-charcoal px-2 py-0.5 text-xs font-bold uppercase', severityColor(severity), className)}
      {...props}
    >
      {children}
    </span>
  );
};
