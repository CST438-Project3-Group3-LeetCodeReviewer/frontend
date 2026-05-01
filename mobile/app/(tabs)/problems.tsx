import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { MOCK_PROBLEMS } from '@/data/mockProblems';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const DIFFICULTY_OPTIONS = ['All', 'Easy', 'Medium', 'Hard'] as const;

const STRATEGY_FILTERS = [
  'Hash Map',
  'Two Pointers',
  'Sliding Window',
  'Tree/Graph Traversal',
  'Binary Search',
  'Heap',
] as const;

export default function ProblemsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<(typeof DIFFICULTY_OPTIONS)[number]>('All');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [difficultyMenuOpen, setDifficultyMenuOpen] = useState(false);

  const filteredProblems = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    return MOCK_PROBLEMS.filter((problem) => {
      const matchesSearch =
        trimmedQuery.length === 0 ||
        problem.title.toLowerCase().includes(trimmedQuery);

      const matchesDifficulty =
        selectedDifficulty === 'All' ||
        problem.difficulty === selectedDifficulty;

      const matchesCategory =
        selectedCategory === null ||
        problem.category.includes(selectedCategory);

      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [searchQuery, selectedDifficulty, selectedCategory]);

  const toggleCategoryFilter = (category: string) => {
    setSelectedCategory((current) => (current === category ? null : category));
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('All');
    setSelectedCategory(null);
    setDifficultyMenuOpen(false);
  };

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

        <View style={styles.controlsSection}>
          <View style={styles.dropdownWrapper}>
            <ThemedText type="defaultSemiBold">Difficulty</ThemedText>

            <Pressable
              onPress={() => setDifficultyMenuOpen((open) => !open)}
              style={({ pressed }) => [
                styles.dropdownButton,
                pressed && styles.cardPressed,
              ]}>
              <ThemedText>{selectedDifficulty}</ThemedText>
              <ThemedText>{difficultyMenuOpen ? '▲' : '▼'}</ThemedText>
            </Pressable>

            {difficultyMenuOpen && (
              <View style={styles.dropdownMenu}>
                {DIFFICULTY_OPTIONS.map((option) => {
                  const isSelected = selectedDifficulty === option;

                  return (
                    <Pressable
                      key={option}
                      onPress={() => {
                        setSelectedDifficulty(option);
                        setDifficultyMenuOpen(false);
                      }}
                      style={({ pressed }) => [
                        styles.dropdownOption,
                        isSelected && styles.dropdownOptionSelected,
                        pressed && styles.cardPressed,
                      ]}>
                      <ThemedText>{option}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles.filtersHeaderRow}>
            <ThemedText type="defaultSemiBold">Categories</ThemedText>

            {(searchQuery || selectedDifficulty !== 'All' || selectedCategory) && (
              <Pressable onPress={clearAllFilters}>
                <ThemedText style={styles.clearText}>Clear all</ThemedText>
              </Pressable>
            )}
          </View>

          <View style={styles.filterButtonsRow}>
            {STRATEGY_FILTERS.map((filter) => {
              const isActive = selectedCategory === filter;

              return (
                <Pressable
                  key={filter}
                  onPress={() => toggleCategoryFilter(filter)}
                  style={({ pressed }) => [
                    styles.filterButton,
                    isActive && styles.filterButtonActive,
                    pressed && styles.cardPressed,
                  ]}>
                  <ThemedText style={isActive ? styles.filterTextActive : undefined}>
                    {filter}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {filteredProblems.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText type="subtitle">No problems found</ThemedText>
            <ThemedText>
              Try changing the search, difficulty, or category filter.
            </ThemedText>
          </View>
        ) : (
          filteredProblems.map((problem) => (
            <Pressable
              key={problem.id}
              onPress={() => router.push(`/problems/${problem.id}`)}
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}>
              <View style={styles.cardHeader}>
                <ThemedText type="subtitle">{problem.title}</ThemedText>
                <ThemedText>{problem.difficulty}</ThemedText>
              </View>

              <View style={styles.tagsRow}>
                {problem.category.map((tag) => {
                  const isActive = selectedCategory === tag;

                  return (
                    <Pressable
                      key={tag}
                      onPress={(event) => {
                        event.stopPropagation();
                        toggleCategoryFilter(tag);
                      }}
                      style={({ pressed }) => [
                        styles.tag,
                        isActive && styles.tagActive,
                        pressed && styles.cardPressed,
                      ]}>
                      <ThemedText style={isActive ? styles.filterTextActive : undefined}>
                        {tag}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

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
  controlsSection: {
    gap: 14,
  },
  dropdownWrapper: {
    gap: 8,
    alignSelf: 'flex-start',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#111',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: 130,
    alignSelf: 'flex-start',
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 12,
    backgroundColor: '#111',
    overflow: 'hidden',
    minWidth: 130,
    alignSelf: 'flex-start',
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  dropdownOptionSelected: {
    backgroundColor: 'rgba(10, 126, 164, 0.18)',
  },
  filtersHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearText: {
    color: '#0a7ea4',
  },
  filterButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  filterButtonActive: {
    backgroundColor: 'rgba(10, 126, 164, 0.18)',
  },
  filterTextActive: {
    color: '#7fd7f7',
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
  tagActive: {
    backgroundColor: 'rgba(10, 126, 164, 0.18)',
  },
});