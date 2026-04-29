import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator,Platform ,StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  (Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080');


export default function FeedbackScreen() {
  const { submissionId } = useLocalSearchParams();

  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   async function fetchFeedback() {
  //     try {
  //       const res = await fetch(
  //         `http://10.0.2.2:8080/submissions/${submissionId}/feedback`
  //       );

  //       const data = await res.json();

        
  //       setFeedback(data);
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchFeedback();
  // }, [submissionId]);
  useEffect(() => {
  async function fetchFeedback() {
    try {
      if (!submissionId) return;

      const res = await fetch(
        `${API_BASE_URL}/submissions/${submissionId}/feedback`
      );

      if (!res.ok) {
        throw new Error(`Feedback request failed: ${res.status}`);
      }

      const data = await res.json();
      setFeedback(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

    fetchFeedback();
  }, [submissionId]);

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
        <ThemedText>Analyzing your code...</ThemedText>
      </ThemedView>
    );
  }

  if (!feedback) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>No feedback available.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">AI Feedback</ThemedText>

      <View style={styles.card}>
        <ThemedText type="subtitle">Score</ThemedText>
        <ThemedText>{feedback.score}/100</ThemedText>
      </View>

      <View style={styles.card}>
        <ThemedText type="subtitle">Review</ThemedText>
        <ThemedText>{feedback.feedbackText}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
});