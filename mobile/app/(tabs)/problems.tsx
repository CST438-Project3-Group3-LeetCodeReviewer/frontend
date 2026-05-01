import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { MOCK_PROBLEMS } from '@/data/mockProblems';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// This is the route that displays all problems using mockProblems.ts
export default function ProblemsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProblems = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    if (!trimmedQuery) {
      return MOCK_PROBLEMS;
    }

    return MOCK_PROBLEMS.filter((problem) =>
      problem.title.toLowerCase().includes(trimmedQuery)
    );
  }, [searchQuery]);

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Problems</ThemedText>
        <ThemedText>
          Browse a small set of interview-style problems for the MVP.
        </ThemedText>

        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by problem title"
          placeholderTextColor="#888"
          style={styles.searchInput}
        />

        {filteredProblems.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText type="subtitle">No problems found</ThemedText>
            <ThemedText>
              Try searching for a different title.
            </ThemedText>
          </View>
        ) : (
          filteredProblems.map((problem) => (
            <Link key={problem.id} href={`/problems/${problem.id}`} asChild>
              <Pressable
                style={({ pressed }) => [
                  styles.card,
                  pressed && styles.cardPressed,
                ]}>
                <View style={styles.cardHeader}>
                  <ThemedText type="subtitle">{problem.title}</ThemedText>
                  <ThemedText>{problem.difficulty}</ThemedText>
                </View>

                <View style={styles.tagsRow}>
                  {problem.category.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <ThemedText>{tag}</ThemedText>
                    </View>
                  ))}
                </View>
              </Pressable>
            </Link>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

// styling the page
const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    padding: 24,
    gap: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: '#fff',
    backgroundColor: '#111',
  },
  emptyState: {
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  tagsRow: {
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
});