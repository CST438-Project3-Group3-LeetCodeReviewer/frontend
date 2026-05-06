import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_BASE_URL, getAuthHeaders } from '@/lib/api';

export type SubmissionSummary = {
  id: number;
  problemId: number;
  problemTitle: string;
  userId: string | null;
  status: string;
  timeTaken: number | null;
  createdAt: string | null;
  feedbackScore: number | null;
  feedbackPreview: string | null;
};

export default function SubmissionsScreen() {
  const router = useRouter();
  const [items, setItems] = useState<SubmissionSummary[]>([]);
  const [message, setMessage] = useState('Loading…');

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function load() {
        setMessage('Loading…');
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          setItems([]);
          setMessage('Sign in to see your submissions.');
          return;
        }

        const userId = session.user.id;

        try {
          const res = await fetch(`${API_BASE_URL}/api/submissions/user/${userId}/summary`, {
            headers: await getAuthHeaders(),
          });

          if (!res.ok) {
            const t = await res.text();
            setItems([]);
            setMessage(`Could not load submissions (${res.status}): ${t}`);
            return;
          }

          const data = (await res.json()) as SubmissionSummary[];
          if (cancelled) return;
          setItems(data);
          setMessage(data.length === 0 ? 'No submissions yet.' : '');
        } catch (e) {
          if (cancelled) return;
          setItems([]);
          setMessage(e instanceof Error ? e.message : 'Request failed');
        }
      }

      load();
      return () => {
        cancelled = true;
      };
    }, []),
  );

  return (
    <ThemedView style={styles.screen}>
      <ThemedText type="title" style={styles.heading}>
        Past submissions
      </ThemedText>
      {message ? <ThemedText style={styles.message}>{message}</ThemedText> : null}

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/feedback',
                params: { submissionId: String(item.id) },
              })
            }>
            <View style={styles.rowTop}>
              <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.title}>
                {item.problemTitle}
              </ThemedText>
              <ThemedText style={styles.badge}>{item.status}</ThemedText>
            </View>
            <ThemedText style={styles.meta}>
              {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
              {item.feedbackScore != null ? ` · Score ${item.feedbackScore}` : ''}
            </ThemedText>
            {item.feedbackPreview ? (
              <ThemedText numberOfLines={2} style={styles.preview}>
                {item.feedbackPreview}
              </ThemedText>
            ) : null}
          </Pressable>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  heading: { marginBottom: 8 },
  message: { marginBottom: 12, opacity: 0.85 },
  list: { paddingBottom: 32, gap: 12 },
  row: {
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1 },
  badge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  meta: { fontSize: 13, opacity: 0.8 },
  preview: { fontSize: 13, opacity: 0.9 },
});
