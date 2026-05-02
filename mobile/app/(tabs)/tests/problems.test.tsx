import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';

import ProblemsScreen from '../problems';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('@/components/themed-text', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    ThemedText: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
  };
});

jest.mock('@/components/themed-view', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    ThemedView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
  };
});

describe('ProblemsScreen', () => {
  it('filters problems when searching by category/tag text', () => {
    render(<ProblemsScreen />);

    const searchInput = screen.getByPlaceholderText('Search by title or tag');
    fireEvent.changeText(searchInput, 'heap');

    expect(screen.getByText(/Smallest Range Covering Elements from K Lists/i)).toBeTruthy();
    expect(screen.getByText(/Kth Largest Element in a Stream/i)).toBeTruthy();
    expect(screen.getByText(/Top K Frequent Elements/i)).toBeTruthy();
    expect(screen.getByText(/Merge k Sorted Lists/i)).toBeTruthy();

    expect(screen.queryByText(/Two Sum/i)).toBeNull();
    expect(screen.queryByText(/Valid Palindrome/i)).toBeNull();
  });
});
