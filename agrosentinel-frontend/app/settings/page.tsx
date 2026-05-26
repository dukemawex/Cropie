'use client';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { SettingsForm } from '@/components/settings/SettingsForm';

export default function SettingsPage() {
  return (
    <DashboardShell title="Settings">
      <SettingsForm
        initial={{
          id: 'local',
          full_name: 'Farmer User',
          phone: '+254700000000',
          country: 'Kenya',
          language: 'en',
          notification_method: 'sms'
        }}
      />
    </DashboardShell>
  );
}
