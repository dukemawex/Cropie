import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream text-charcoal">
      <div className="absolute inset-0 animate-pulseRadar bg-[radial-gradient(circle_at_20%_20%,rgba(200,245,60,0.35),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(26,61,43,0.25),transparent_40%),radial-gradient(circle_at_60%_80%,rgba(200,245,60,0.20),transparent_35%)] bg-[length:200%_200%]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 grid-overlay" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="h-20 w-full bg-gradient-to-b from-white/30 to-transparent animate-scanline" />
      </div>

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <p className="font-mono text-sm uppercase">AgroSentinel</p>
        <h1 className="mt-4 max-w-3xl font-heading text-5xl font-bold leading-tight md:text-6xl">
          Satellite-powered crop disease detection for African farmers
        </h1>
        <p className="mt-5 max-w-2xl text-lg">
          Early disease signals from multispectral satellite data, transformed into practical action for smallholder farmers.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/auth/register">
            <Button>Get Started</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-white">View Demo</Button>
          </Link>
        </div>

        <div className="panel mt-12 grid gap-3 p-4 text-center md:grid-cols-3">
          <div>
            <p className="font-mono text-xl font-bold">12 countries covered</p>
          </div>
          <div>
            <p className="font-mono text-xl font-bold">340,000 farmers protected</p>
          </div>
          <div>
            <p className="font-mono text-xl font-bold">89% detection accuracy</p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            'Early Warning',
            'Offline SMS Alerts',
            'Multi-language',
            'Free for smallholders'
          ].map((feature) => (
            <div key={feature} className="panel p-5">
              <h3 className="font-heading text-xl">{feature}</h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
