import { Platform } from 'react-native';

import { supabase } from './supabase';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  (Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080');

/** JSON headers plus Supabase Bearer when logged in (needed for guarded submission APIs). */
export async function getAuthHeaders(): Promise<HeadersInit & Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: HeadersInit & Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = session?.access_token;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

const BACKEND_URL = API_BASE_URL;

export async function callBackendEndpoint(endpoint: string, method: string = 'GET', body?: any) {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('No session found');
  }

  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  return response.json();
}
