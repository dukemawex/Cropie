'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <h1 className="font-heading text-3xl">Sign in</h1>
      <form onSubmit={submit} className="mt-6 space-y-3 panel p-5">
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit">Login</Button>
      </form>
      <p className="mt-4 text-sm">
        No account? <Link href="/auth/register" className="underline">Register</Link>
      </p>
    </main>
  );
}
