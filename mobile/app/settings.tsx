import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_BASE_URL, getAuthHeaders } from '@/lib/api';

export default function SettingsScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        if (!cancelled) {
          setStatus('You must be signed in.');
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/users/me/profile`, {
          headers: await getAuthHeaders(),
        });
        if (res.ok) {
          const body = await res.json();
          if (!cancelled) setFullName(body.fullName ?? '');
        } else if (res.status === 404) {
          if (!cancelled) setStatus('Profile not found in database. Saving may return 404 until the user row exists.');
        } else {
          if (!cancelled) setStatus(`Load failed (${res.status})`);
        }
      } catch (e) {
        if (!cancelled) setStatus(e instanceof Error ? e.message : 'Load failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function saveProfile() {
    const trimmed = fullName.trim();
    if (!trimmed) {
      setStatus('Full name cannot be empty.');
      return;
    }

    setSaving(true);
    setStatus('Saving…');

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/me/profile`, {
        method: 'PUT',
        headers: await getAuthHeaders(),
        body: JSON.stringify({ fullName: trimmed }),
      });

      if (!res.ok) {
        const t = await res.text();
        setStatus(`Save failed (${res.status}): ${t}`);
        return;
      }

      setStatus('Saved.');
      router.back();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  function confirmDeleteAccount() {
    Alert.alert(
      'Delete account',
      'This removes your row from the app database. Supabase auth may still need separate handling.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => void deleteAccount(),
        },
      ],
    );
  }

  async function deleteAccount() {
    setSaving(true);
    setStatus('Deleting…');

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/me/account`, {
        method: 'DELETE',
        headers: await getAuthHeaders(),
      });

      if (res.status !== 204 && !res.ok) {
        const t = await res.text();
        setStatus(`Delete failed (${res.status}): ${t}`);
        return;
      }

      await supabase.auth.signOut();
      router.replace('/login');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Settings' }} />
      <ThemedView style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="subtitle">Display name</ThemedText>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Your name"
            placeholderTextColor="#888"
            style={styles.input}
            editable={!loading && !saving}
          />

          {status ? <ThemedText>{status}</ThemedText> : null}

          <Pressable
            style={[styles.primaryBtn, saving && styles.disabled]}
            onPress={() => void saveProfile()}
            disabled={saving || loading}>
            <ThemedText type="defaultSemiBold">{saving ? 'Saving…' : 'Save'}</ThemedText>
          </Pressable>

          <Pressable
            style={[styles.dangerBtn, saving && styles.disabled]}
            onPress={confirmDeleteAccount}
            disabled={saving || loading}>
            <ThemedText type="defaultSemiBold" style={styles.dangerText}>
              Delete account (app DB)
            </ThemedText>
          </Pressable>
        </ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 24, gap: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
  },
  primaryBtn: {
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dangerBtn: {
    borderWidth: 1,
    borderColor: '#d32f2f',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(211, 47, 47, 0.08)',
  },
  dangerText: { color: '#d32f2f' },
  disabled: { opacity: 0.5 },
});
