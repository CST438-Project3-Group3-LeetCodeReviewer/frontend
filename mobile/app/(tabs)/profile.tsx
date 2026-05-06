import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_BASE_URL, getAuthHeaders } from '@/lib/api';

type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  oauthProvider: string;
  createdAt: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState('Loading profile…');
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function load() {
        setStatus('Loading profile…');
        const { data: { session } } = await supabase.auth.getSession();
        if (cancelled) return;

        setSessionEmail(session?.user?.email ?? null);

        if (!session?.access_token) {
          setProfile(null);
          setStatus('Not signed in.');
          return;
        }

        try {
          const res = await fetch(`${API_BASE_URL}/api/users/me/profile`, {
            headers: await getAuthHeaders(),
          });

          if (res.status === 404) {
            setProfile(null);
            setStatus(
              'No profile row in the database yet for this account. After OAuth, your team may sync users into Postgres; until then you can still submit if the backend accepts your user id.',
            );
            return;
          }

          if (!res.ok) {
            const t = await res.text();
            setProfile(null);
            setStatus(`Could not load profile (${res.status}): ${t}`);
            return;
          }

          const body = await res.json();
          if (cancelled) return;
          setProfile({
            id: body.id,
            email: body.email,
            fullName: body.fullName,
            oauthProvider: body.oauthProvider,
            createdAt: body.createdAt,
          });
          setStatus('');
        } catch (e) {
          if (cancelled) return;
          setProfile(null);
          setStatus(e instanceof Error ? e.message : 'Request failed');
        }
      }

      load();
      return () => {
        cancelled = true;
      };
    }, []),
  );

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Profile</ThemedText>
        {sessionEmail ? (
          <ThemedText type="defaultSemiBold">Signed in as {sessionEmail}</ThemedText>
        ) : null}

        {status ? <ThemedText>{status}</ThemedText> : null}

        {profile ? (
          <ThemedView style={styles.card}>
            <ThemedText type="subtitle">{profile.fullName}</ThemedText>
            <ThemedText>{profile.email}</ThemedText>
            <ThemedText>Provider: {profile.oauthProvider}</ThemedText>
            <ThemedText>User id: {profile.id}</ThemedText>
            <ThemedText>Created: {profile.createdAt}</ThemedText>
          </ThemedView>
        ) : null}

        <Pressable
          style={styles.primaryBtn}
          onPress={() => router.push('/settings')}>
          <ThemedText type="defaultSemiBold">Settings</ThemedText>
        </Pressable>

        <Pressable
          style={styles.primaryBtn}
          onPress={() => router.push('/(tabs)/submissions')}>
          <ThemedText type="defaultSemiBold">Past submissions</ThemedText>
        </Pressable>

        <Pressable style={styles.dangerBtn} onPress={handleLogout}>
          <ThemedText type="defaultSemiBold" style={styles.dangerText}>
            Log out
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 24, gap: 16 },
  card: {
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  primaryBtn: {
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  dangerBtn: {
    borderWidth: 1,
    borderColor: '#d32f2f',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(211, 47, 47, 0.08)',
  },
  dangerText: { color: '#d32f2f' },
});
