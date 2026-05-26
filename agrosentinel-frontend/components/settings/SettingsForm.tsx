'use client';

import { FormEvent, useState } from 'react';
import { UserProfile } from '@/types';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export const SettingsForm = ({ initial }: { initial: UserProfile }) => {
  const [form, setForm] = useState(initial);
  const [saved, setSaved] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <form onSubmit={submit} className="grid max-w-2xl gap-3">
      <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Full name" />
      <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
      <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" />

      <Select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value as UserProfile['language'] })}>
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="sw">Swahili</option>
        <option value="ha">Hausa</option>
        <option value="yo">Yoruba</option>
      </Select>

      <Select
        value={form.notification_method}
        onChange={(e) => setForm({ ...form, notification_method: e.target.value as UserProfile['notification_method'] })}
      >
        <option value="sms">SMS</option>
        <option value="whatsapp">WhatsApp</option>
      </Select>

      <Button type="submit">{saved ? 'Saved' : 'Save Settings'}</Button>
    </form>
  );
};
