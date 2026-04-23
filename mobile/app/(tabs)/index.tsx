import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const [backendStatus, setBackendStatus] = useState('Not checked');
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);

  async function checkBackendStatus() {
    setIsCheckingBackend(true);
    setBackendStatus('Checking...');

    const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

    try {
      const response = await fetch(`${apiBaseUrl}/api/health`);
      if (!response.ok) {
        setBackendStatus(`Backend unreachable (${response.status})`);
        return;
      }

      setBackendStatus('Backend is live');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setBackendStatus(`Request failed: ${message}`);
    } finally {
      setIsCheckingBackend(false);
    }
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.section}>
          <ThemedText type="title">LeetCode Coach</ThemedText>
          <ThemedText>
            Your MVP is running. This is the first screen for the mobile app.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Today&apos;s Goal</ThemedText>
          <ThemedText>1. Pick a problem</ThemedText>
          <ThemedText>2. Track attempts</ThemedText>
          <ThemedText>3. Review hints and patterns</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Backend Status</ThemedText>
          <ThemedText>{backendStatus}</ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={checkBackendStatus}
            disabled={isCheckingBackend}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              isCheckingBackend && styles.buttonDisabled,
            ]}>
            <ThemedText type="defaultSemiBold">
              {isCheckingBackend ? 'Checking...' : 'Check backend health'}
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 20,
  },
  section: {
    gap: 8,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  button: {
    marginTop: 8,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#0a7ea4',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
