import { Alert, Farm } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function apiFetch<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: 'no-store'
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const getFarms = (token?: string) => apiFetch<Farm[]>('/farms', {}, token);

export const createFarm = (payload: Partial<Farm>, token?: string) =>
  apiFetch<Farm>('/farms', { method: 'POST', body: JSON.stringify(payload) }, token);

export const deleteFarm = (id: string, token?: string) =>
  apiFetch<{ success: boolean }>(`/farms/${id}`, { method: 'DELETE' }, token);

export const analyzeFarm = (farmId: string, token?: string) =>
  apiFetch<Alert>(`/analyze/${farmId}`, { method: 'POST' }, token);

export const getAlerts = (farmId: string, token?: string) => apiFetch<Alert[]>(`/alerts/${farmId}`, {}, token);

export const notifyUser = (alertId: string, token?: string) =>
  apiFetch<{ success: boolean }>(`/notify/${alertId}`, { method: 'POST' }, token);
