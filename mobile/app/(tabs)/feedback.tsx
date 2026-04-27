import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/themed-text";

export default function FeedbackScreen() {
  const { submissionId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <ThemedText type="title">Submission Feedback</ThemedText>

      <ThemedText>Submission ID: {submissionId}</ThemedText>

      <View style={styles.card}>
        <ThemedText type="subtitle">Score</ThemedText>
        <ThemedText>85 / 100</ThemedText>
      </View>

      <View style={styles.card}>
        <ThemedText type="subtitle">AI Feedback</ThemedText>
        <ThemedText>
          Your solution is correct and efficient. Consider optimizing space usage.
        </ThemedText>
      </View>

      <View style={styles.card}>
        <ThemedText type="subtitle">Suggestions</ThemedText>
        <ThemedText>
          • Use a hash map for faster lookups  
          • Reduce nested loops  
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
});