import { supabase } from './supabase';

const BACKEND_URL = 'http://localhost:8080';

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
