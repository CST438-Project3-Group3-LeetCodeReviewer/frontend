export type Example = {
  input: string;
  output: string;
  explanation?: string;
};

export type Problem = {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string[];
  description: string;
  examples: Example[];
  hints?: string[];
  starterCode?: string;
};