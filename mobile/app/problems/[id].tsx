import React, { useEffect, useMemo, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { formatElapsedTime, getProblemById } from '@/utils/problemHelpers';
import { MOCK_PROBLEMS } from '@/data/mockProblems';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  (Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080');

// Temporary demo user ID for local/testing submissions.
// Once auth/session user data is connected, remove this constant and
// replace `userId: DEMO_USER_ID` in the submissionPayload (around line 85)
// with the authenticated user's real UUID.
const DEMO_USER_ID = '11111111-1111-1111-1111-111111111111';

// This is the route that displays the individual problems by id and uses mockProblems.ts
export default function ProblemDetailScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const problem = useMemo(() => (id ? getProblemById(id) : undefined), [id]);

  const problemIndex = useMemo(
    () => (id ? MOCK_PROBLEMS.findIndex((p) => p.id === id) : -1),
    [id],
  );

  const prevProblem =
    problemIndex > 0 ? MOCK_PROBLEMS[problemIndex - 1] : undefined;

  const nextProblem =
    problemIndex >= 0 && problemIndex < MOCK_PROBLEMS.length - 1
      ? MOCK_PROBLEMS[problemIndex + 1]
      : undefined;

  const [code, setCode] = useState(problem?.starterCode ?? '');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [testOutput, setTestOutput] = useState('No tests run yet.');
  const [complexityOutput, setComplexityOutput] = useState('Not analyzed yet.');

  useEffect(() => {
    if (!problem) return;
    setCode(problem.starterCode ?? '');
  }, [problem]);

  useEffect(() => {
    setSecondsElapsed(0);
    setTestOutput('No tests run yet.');
    setComplexityOutput('Not analyzed yet.');
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function handleRunCode() {
    setTestOutput(
      'Mock test run complete. Your code executed against sample test cases.',
    );
    setComplexityOutput('Mock estimate: Time O(n), Space O(n)');
  }

  async function handleSubmit() {
    if (!problem) {
      Alert.alert('Error', 'Problem not found.');
      return;
    }

    const submissionPayload = {
      problemId: problem.dbId,
      code,
      userId: DEMO_USER_ID,
      status: 'Submitted',
      timeTaken: secondsElapsed,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Submission failed: ${response.status} ${errorText}`);
      }

      const submission = await response.json();

      router.push({
        pathname: '/(tabs)/feedback',
        params: { submissionId: String(submission.id) },
      });
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        'Error',
        'Submission failed. Check the console and make sure userId is a real UUID from your users table.',
      );
    }
  }

  if (!problem) {
    return (
      <>
        <Stack.Screen options={{ title: 'Problem not found' }} />
        <ThemedView style={styles.centered}>
          <ThemedText type="title">Problem not found</ThemedText>
        </ThemedView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: problem.title }} />
      <ThemedView style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <ThemedText type="title">{problem.title}</ThemedText>
              <ThemedText>{problem.difficulty}</ThemedText>
            </View>

            <View style={styles.timerCard}>
              <ThemedText type="defaultSemiBold">Timer</ThemedText>
              <ThemedText>{formatElapsedTime(secondsElapsed)}</ThemedText>
            </View>
          </View>

          <View style={styles.problemNavRow}>
            <Pressable
              onPress={() =>
                prevProblem && router.replace(`/problems/${prevProblem.id}`)
              }
              disabled={!prevProblem}
              style={({ pressed }) => [
                styles.problemNavButton,
                !prevProblem && styles.problemNavButtonDisabled,
                pressed && prevProblem && styles.problemNavButtonPressed,
              ]}>
              <ThemedText
                style={!prevProblem ? styles.problemNavLabelDisabled : undefined}>
                ← Previous
              </ThemedText>
            </Pressable>

            {problemIndex >= 0 ? (
              <ThemedText style={styles.problemNavPosition}>
                {problemIndex + 1} / {MOCK_PROBLEMS.length}
              </ThemedText>
            ) : null}

            <Pressable
              onPress={() =>
                nextProblem && router.replace(`/problems/${nextProblem.id}`)
              }
              disabled={!nextProblem}
              style={({ pressed }) => [
                styles.problemNavButton,
                !nextProblem && styles.problemNavButtonDisabled,
                pressed && nextProblem && styles.problemNavButtonPressed,
              ]}>
              <ThemedText
                style={!nextProblem ? styles.problemNavLabelDisabled : undefined}>
                Next →
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.tagRow}>
            {problem.category.map((tag) => (
              <View key={tag} style={styles.tag}>
                <ThemedText>{tag}</ThemedText>
              </View>
            ))}
          </View>

          <Section title="Problem">
            <ThemedText>{problem.description}</ThemedText>
          </Section>

          <Section title="Examples">
            {problem.examples.map((example, index) => (
              <View key={index} style={styles.exampleBox}>
                <ThemedText type="defaultSemiBold">Input:</ThemedText>
                <ThemedText>{example.input}</ThemedText>

                <ThemedText type="defaultSemiBold">Output:</ThemedText>
                <ThemedText>{example.output}</ThemedText>

                {example.explanation ? (
                  <>
                    <ThemedText type="defaultSemiBold">Explanation:</ThemedText>
                    <ThemedText>{example.explanation}</ThemedText>
                  </>
                ) : null}
              </View>
            ))}
          </Section>

          <Section title="Hints">
            {problem.hints?.map((hint, index) => (
              <ThemedText key={index}>• {hint}</ThemedText>
            ))}
          </Section>

          <Section title="Code Editor">
            <TextInput
              multiline
              value={code}
              onChangeText={setCode}
              style={styles.editor}
              placeholder="Write your solution here..."
              placeholderTextColor="#888"
              textAlignVertical="top"
            />

            <View style={styles.buttonRow}>
              <Pressable style={styles.primaryButton} onPress={handleRunCode}>
                <ThemedText type="defaultSemiBold">Run Code</ThemedText>
              </Pressable>

              <Pressable style={styles.secondaryButton} onPress={handleSubmit}>
                <ThemedText type="defaultSemiBold">Submit</ThemedText>
              </Pressable>
            </View>
          </Section>

          <Section title="Test Results">
            <ThemedText>{testOutput}</ThemedText>
          </Section>

          <Section title="Time & Space Complexity">
            <ThemedText>{complexityOutput}</ThemedText>
          </Section>
        </ScrollView>
      </ThemedView>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <ThemedText type="subtitle">{title}</ThemedText>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    padding: 20,
    gap: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  problemNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  problemNavButton: {
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexShrink: 1,
  },
  problemNavButtonDisabled: {
    borderColor: '#3A3A3A',
    opacity: 0.45,
  },
  problemNavButtonPressed: {
    opacity: 0.85,
  },
  problemNavLabelDisabled: {
    opacity: 0.7,
  },
  problemNavPosition: {
    opacity: 0.85,
  },
  timerCard: {
    minWidth: 110,
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  section: {
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  sectionBody: {
    gap: 10,
  },
  exampleBox: {
    borderWidth: 1,
    borderColor: '#2F2F2F',
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  editor: {
    minHeight: 260,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    fontFamily: 'monospace',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  primaryButton: {
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
});