/**
 * Shared TypeScript types for coding problems and their examples.
 * Used by the mock data and problem pages to keep data structure consistent.
 */
export type Example = {
  input: string;
  output: string;
  explanation?: string;
};

export type Problem = {
  dbId: number;
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string[];
  description: string;
  examples: Example[];
  hints?: string[];
  starterCode?: string;
};