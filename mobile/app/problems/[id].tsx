import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  Alert,
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

//This is the route that displays the individual problems by id and uses mockProblems.ts
export default function ProblemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const problem = useMemo(() => getProblemById(id), [id]);

  const [code, setCode] = useState(problem?.starterCode ?? '');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [testOutput, setTestOutput] = useState('No tests run yet.');
  const [complexityOutput, setComplexityOutput] = useState('Not analyzed yet.');
  const [aiFeedbackOutput, setAiFeedbackOutput] = useState('AI feedback placeholder.');

  useEffect(() => {
    if (!problem) return;
    setCode(problem.starterCode ?? '');
  }, [problem]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

//Creates the timer on the page
  function formatTime(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map((n) => String(n).padStart(2, '0'))
      .join(':');
  }

  function handleRunCode() {
    setTestOutput('Mock test run complete. Your code executed against sample test cases.');
    setComplexityOutput('Mock estimate: Time O(n), Space O(n)');
  }

  async function handleSubmit() {
    // setAiFeedbackOutput(
    //   'Placeholder feedback: structure is clear, but AI review and backend submission are not connected yet.'
    // );
    // Alert.alert('Submitted', 'Mock submission recorded for UI demo.');
  try {
    const response = await fetch("http://10.0.2.2:8080/api/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        problemId: id,
        code: code,
        userId: 1,
      }),
    });

    if (!response.ok) {
      throw new Error("Submission failed");
    }

    const data = await response.json();

    router.push({
    pathname: "/(tabs)/feedback",
    params: { submissionId: data.id },
    });

  } catch (error: any) {
    console.error(error);
    Alert.alert("Error", "Submission failed");
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
      //Grabs the title from mockProblems
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

          <View style={styles.tagRow}>
            {problem.category.map((tag) => (
              <View key={tag} style={styles.tag}>
                <ThemedText>{tag}</ThemedText>
              </View>
            ))}
          </View>

          //displays the problem information from mockProblems
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

            //text box for inputting your code
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

            //placeholders for future integrations with code submission information
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

          <Section title="AI Feedback">
            <ThemedText>{aiFeedbackOutput}</ThemedText>
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

//styling the page
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