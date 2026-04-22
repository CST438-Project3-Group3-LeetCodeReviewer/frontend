import {MOCK_PROBLEMS} from '@/data/mockProblems';

// Utility functions for problem detail pages, including problem lookup by id
// and formatting elapsed timer values for display.
export function getProblemById(id: string) {
  return MOCK_PROBLEMS.find((problem) => problem.id === id);
}

export function formatElapsedTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
}