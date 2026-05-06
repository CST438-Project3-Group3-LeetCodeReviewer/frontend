import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { ProblemCodeEditor } from '@/components/problem-code-editor';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  clearFeedbackCodeHandoff,
  peekFeedbackCodeHandoff,
} from '@/lib/feedback-handoff';
import { API_BASE_URL, getAuthHeaders } from '@/lib/api';

type FeedbackDto = {
  score: number | null;
  feedbackText?: string | null;
};

const DEFAULT_LANGUAGE = 'python';

export default function FeedbackScreen() {
  const rawId = useLocalSearchParams<{ submissionId: string | string[] }>().submissionId;
  const submissionId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState<FeedbackDto | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useLayoutEffect(() => {
    if (!submissionId) return;
    const fromHandoff = peekFeedbackCodeHandoff(submissionId);
    if (fromHandoff) {
      setCode(fromHandoff);
      setLoading(false);
    }
  }, [submissionId]);

  const fetchData = useCallback(
    async (showPageLoader: boolean) => {
      if (!submissionId) return;
      if (showPageLoader && peekFeedbackCodeHandoff(submissionId) === undefined) {
        setLoading(true);
      }
      try {
        const headers = await getAuthHeaders();

        const [subRes, fbRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/submissions/${submissionId}`, { headers }),
          fetch(`${API_BASE_URL}/api/submissions/${submissionId}/feedback`),
        ]);

        if (subRes.ok) {
          const sub = await subRes.json();
          setCode(typeof sub.code === 'string' ? sub.code : '');
          clearFeedbackCodeHandoff(submissionId);
          setSubmissionStatus(typeof sub.status === 'string' ? sub.status : null);
        } else if (subRes.status === 401) {
          setSubmitMessage((m) => m || 'Sign in required to edit this submission.');
        }

        if (fbRes.ok) {
          const data = await fbRes.json();
          setFeedback({
            score: typeof data.score === 'number' ? data.score : null,
            feedbackText: data.feedbackText ?? '',
          });
        }
      } catch (e) {
        console.error(e);
        setSubmitMessage('Could not load submission or feedback.');
      } finally {
        if (showPageLoader) setLoading(false);
      }
    },
    [submissionId],
  );

  useEffect(() => {
    setSubmitMessage('');
    void fetchData(true);
  }, [submissionId, fetchData]);

  async function handleSaveAndReview() {
    if (!submissionId) return;

    const trimmed = code.trim();
    if (trimmed.length < 10) {
      setSubmitMessage('Write a fuller solution before re-running review.');
      return;
    }

    setSaving(true);
    setSubmitMessage('Re-running review…');

    try {
      const res = await fetch(`${API_BASE_URL}/api/submissions/${submissionId}`, {
        method: 'PUT',
        headers: await getAuthHeaders(),
        body: JSON.stringify({
          code: trimmed,
          language: DEFAULT_LANGUAGE,
        }),
      });

      if (!res.ok) {
        const t = await res.text();
        setSubmitMessage(`Save failed (${res.status}): ${t || 'unknown error'}`);
        return;
      }

      await fetchData(false);
      setSubmitMessage('Review updated with your edited code.');
    } catch (e) {
      setSubmitMessage(e instanceof Error ? e.message : 'Request failed.');
    } finally {
      setSaving(false);
    }
  }

  if (!submissionId) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Missing submission id.</ThemedText>
      </ThemedView>
    );
  }

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
        <ThemedText>Loading your submission…</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ThemedText type="title">Review</ThemedText>
        {submissionStatus ? (
          <ThemedText style={styles.muted}>Status: {submissionStatus}</ThemedText>
        ) : null}

        <View style={styles.editorSection}>
          <ThemedText type="subtitle">Your submission</ThemedText>
          <ThemedText style={styles.hint}>
            Continue from the code you shipped. Save to run another AI review after edits.
          </ThemedText>
          <ProblemCodeEditor
            value={code}
            onChange={setCode}
            style={[
              styles.editor,
              Platform.OS === 'web' ? { minHeight: 260 } : { minHeight: 220 },
            ]}
          />
          <Pressable
            accessibilityRole="button"
            disabled={saving}
            onPress={() => void handleSaveAndReview()}
            style={({ pressed }) => [
              styles.saveBtn,
              (pressed || saving) && styles.pressedBtn,
              saving && styles.dimmedBtn,
            ]}>
            <ThemedText style={styles.saveBtnLabel}>{saving ? 'Reviewing…' : 'Save & re-run review'}</ThemedText>
          </Pressable>
          {submitMessage ? (
            <ThemedText style={styles.message}>{submitMessage}</ThemedText>
          ) : null}
        </View>

        <View style={styles.feedbackSection}>
          <ThemedText type="subtitle">AI feedback</ThemedText>
          {feedback ? (
            <>
              <View style={styles.card}>
                <ThemedText type="defaultSemiBold">Score</ThemedText>
                <ThemedText>{feedback.score ?? '—'}/100</ThemedText>
              </View>

              <View style={styles.card}>
                <ThemedText type="defaultSemiBold">Review</ThemedText>
                <ThemedText>{feedback.feedbackText ?? '—'}</ThemedText>
              </View>
            </>
          ) : (
            <ThemedText style={styles.muted}>No feedback available yet.</ThemedText>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: 20,
    paddingBottom: 40,
    gap: 14,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  muted: {
    opacity: 0.75,
  },
  hint: {
    opacity: 0.85,
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  editorSection: {
    gap: 12,
    marginTop: 4,
  },
  feedbackSection: {
    gap: 12,
    marginTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#3A3A3A',
    paddingTop: 18,
  },
  editor: {
    minHeight: 260,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 12,
    padding: Platform.OS === 'web' ? 0 : 12,
    color: '#fff',
    fontFamily: Platform.OS === 'web' ? undefined : 'monospace',
    fontSize: 14,
  },
  saveBtn: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(10, 126, 164, 0.18)',
    marginTop: 4,
  },
  pressedBtn: { opacity: 0.82 },
  dimmedBtn: { opacity: 0.55 },
  saveBtnLabel: { color: '#7fd7f7', fontWeight: '700' },
  message: { fontSize: 14, opacity: 0.9 },
});
