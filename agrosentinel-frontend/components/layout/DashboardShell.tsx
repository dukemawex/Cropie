'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/farms', label: 'Farms' },
  { href: '/alerts', label: 'Alerts' },
  { href: '/settings', label: 'Settings' }
];

export const DashboardShell = ({ title, userName, children }: { title: string; userName?: string; children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-cream text-charcoal">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[220px_1fr]">
        <aside className="border-r-2 border-charcoal bg-primary p-4 text-cream">
          <h2 className="font-heading text-2xl">AgroSentinel</h2>
          <nav className="mt-6 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn('block border-2 border-transparent px-3 py-2 font-medium hover:border-cream', pathname === link.href && 'border-cream bg-cream/10')}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="p-6">
          <header className="mb-6 flex items-center justify-between border-2 border-charcoal bg-white px-4 py-3 shadow-panel">
            <div>
              <h1 className="font-heading text-2xl">{title}</h1>
              <p className="text-sm">Welcome back{userName ? `, ${userName}` : ''}</p>
            </div>
            <div className="relative border-2 border-charcoal p-2">
              <Bell size={20} />
              <span className="absolute -right-2 -top-2 rounded-full border-2 border-charcoal bg-accent px-1.5 text-xs font-bold">3</span>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
};
