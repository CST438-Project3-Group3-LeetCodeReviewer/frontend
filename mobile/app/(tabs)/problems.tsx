import { useMemo, useState } from 'react';
import {
  Keyboard,
  Modal,
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
const SORT_OPTIONS = [
  { label: 'Number (Ascending)', value: 'number-asc' },
  { label: 'Number (Descending)', value: 'number-desc' },
  { label: 'Alphabetical (A-Z)', value: 'alpha-asc' },
  { label: 'Alphabetical (Z-A)', value: 'alpha-desc' },
] as const;

const STRATEGY_FILTERS = [
  'Hash Map',
  'Two Pointers',
  'Sliding Window',
  'Tree/Graph Traversal',
  'Binary Search',
  'Heap',
] as const;

type DifficultyOption = (typeof DIFFICULTY_OPTIONS)[number];
type SortOption = (typeof SORT_OPTIONS)[number]['value'];

export default function ProblemsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyOption>('All');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<SortOption>('number-asc');
  const [filtersMenuOpen, setFiltersMenuOpen] = useState(false);

  const problemNumberMap = useMemo(() => {
    return new Map(MOCK_PROBLEMS.map((problem, index) => [problem.id, index + 1]));
  }, []);

  const displayedProblems = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    const filtered = MOCK_PROBLEMS.filter((problem) => {
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

    const sorted = [...filtered].sort((a, b) => {
      const aNumber = problemNumberMap.get(a.id) ?? 0;
      const bNumber = problemNumberMap.get(b.id) ?? 0;

      switch (selectedSort) {
        case 'number-desc':
          return bNumber - aNumber;
        case 'alpha-asc':
          return a.title.localeCompare(b.title);
        case 'alpha-desc':
          return b.title.localeCompare(a.title);
        case 'number-asc':
        default:
          return aNumber - bNumber;
      }
    });

    return sorted;
  }, [
    searchQuery,
    selectedDifficulty,
    selectedCategory,
    selectedSort,
    problemNumberMap,
  ]);

  const toggleCategoryFilter = (category: string) => {
    setSelectedCategory((current) => (current === category ? null : category));
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('All');
    setSelectedCategory(null);
    setSelectedSort('number-asc');
    setFiltersMenuOpen(false);
  };

  const openRandomProblem = () => {
    if (displayedProblems.length === 0) return;

    const randomIndex = Math.floor(Math.random() * displayedProblems.length);
    const randomProblem = displayedProblems[randomIndex];

    router.push(`/problems/${randomProblem.id}`);
  };

  const hasActiveFilters =
    searchQuery.length > 0 ||
    selectedDifficulty !== 'All' ||
    selectedCategory !== null ||
    selectedSort !== 'number-asc';

  return (
    <ThemedView style={styles.screen}>
      <Modal
        visible={filtersMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setFiltersMenuOpen(false)}>
        <View style={styles.modalRoot}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setFiltersMenuOpen(false)}
          />
          <View style={styles.modalMenuOuter} pointerEvents="box-none">
            <View style={styles.filtersMenu}>
              <View style={styles.menuSection}>
                <ThemedText type="defaultSemiBold">Sort</ThemedText>

                {SORT_OPTIONS.map((option) => {
                  const isSelected = selectedSort === option.value;

                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => {
                        setSelectedSort(option.value);
                        setFiltersMenuOpen(false);
                      }}
                      style={({ pressed }) => [
                        styles.menuOption,
                        isSelected && styles.menuOptionSelected,
                        pressed && styles.cardPressed,
                      ]}>
                      <ThemedText>{option.label}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.menuDivider} />

              <View style={styles.menuSection}>
                <ThemedText type="defaultSemiBold">Difficulty</ThemedText>

                {DIFFICULTY_OPTIONS.map((option) => {
                  const isSelected = selectedDifficulty === option;

                  return (
                    <Pressable
                      key={option}
                      onPress={() => {
                        setSelectedDifficulty(option);
                        setFiltersMenuOpen(false);
                      }}
                      style={({ pressed }) => [
                        styles.menuOption,
                        isSelected && styles.menuOptionSelected,
                        pressed && styles.cardPressed,
                      ]}>
                      <ThemedText>{option}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}>
        <ThemedText type="title">Problems</ThemedText>
        <ThemedText>
          Browse a small set of interview-style problems for the MVP.
        </ThemedText>

        <View style={styles.searchInputContainer}>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by problem title"
            placeholderTextColor="#888"
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          {searchQuery.length > 0 ? (
            <Pressable
              onPress={() => {
                setSearchQuery('');
                Keyboard.dismiss();
              }}
              style={({ pressed }) => [
                styles.clearSearchButton,
                pressed && styles.cardPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Clear search">
              <ThemedText style={styles.clearSearchGlyph}>×</ThemedText>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.topControlsRow}>
          <Pressable
            onPress={() => setFiltersMenuOpen((open) => !open)}
            style={({ pressed }) => [
              styles.dropdownButton,
              pressed && styles.cardPressed,
            ]}>
            <ThemedText>Filters</ThemedText>
            <ThemedText>{filtersMenuOpen ? '▲' : '▼'}</ThemedText>
          </Pressable>

          <Pressable
            onPress={openRandomProblem}
            disabled={displayedProblems.length === 0}
            style={({ pressed }) => [
              styles.randomButton,
              displayedProblems.length === 0 && styles.randomButtonDisabled,
              pressed && styles.cardPressed,
            ]}>
            <ThemedText>Random</ThemedText>
          </Pressable>
        </View>

        <View style={styles.controlsSection}>
          <View style={styles.filtersHeaderRow}>
            <ThemedText type="defaultSemiBold">Categories</ThemedText>

            {hasActiveFilters && (
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

        <ThemedText style={styles.resultCountText}>
          {displayedProblems.length === MOCK_PROBLEMS.length
            ? `${displayedProblems.length} problems`
            : `${displayedProblems.length} of ${MOCK_PROBLEMS.length} problems`}
        </ThemedText>

        {displayedProblems.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText type="subtitle">No problems found</ThemedText>
            <ThemedText>
              Try changing the search, sort, difficulty, or category filter.
            </ThemedText>
          </View>
        ) : (
          displayedProblems.map((problem) => {
            const problemNumber = problemNumberMap.get(problem.id) ?? 0;

            return (
              <Pressable
                key={problem.id}
                onPress={() => router.push(`/problems/${problem.id}`)}
                style={({ pressed }) => [
                  styles.card,
                  pressed && styles.cardPressed,
                ]}>
                <View style={styles.cardHeader}>
                  <ThemedText type="subtitle">
                    {problemNumber}. {problem.title}
                  </ThemedText>
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
            );
          })
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
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 12,
    backgroundColor: '#111',
    paddingRight: 6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: '#fff',
    fontSize: 16,
  },
  clearSearchButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearSearchGlyph: {
    fontSize: 22,
    lineHeight: 24,
    color: '#888',
  },
  resultCountText: {
    opacity: 0.85,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  modalMenuOuter: {
    width: '100%',
    maxWidth: 340,
  },
  topControlsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flexWrap: 'wrap',
  },
  controlsSection: {
    gap: 14,
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
    gap: 12,
  },
  filtersMenu: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#3A3A3A',
    borderRadius: 12,
    backgroundColor: '#111',
    overflow: 'hidden',
  },
  menuSection: {
    padding: 10,
    gap: 6,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#2A2A2A',
  },
  menuOption: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  menuOptionSelected: {
    backgroundColor: 'rgba(10, 126, 164, 0.18)',
  },
  randomButton: {
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#111',
    alignSelf: 'flex-start',
  },
  randomButtonDisabled: {
    opacity: 0.5,
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