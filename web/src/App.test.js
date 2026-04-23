import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app heading and tagline', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /leetcode coach/i })).toBeInTheDocument();
  expect(
    screen.getByText(/practice smarter with feedback-driven problem solving/i)
  ).toBeInTheDocument();
});

test('renders primary call-to-action buttons', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /browse problems/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /view dashboard/i })).toBeInTheDocument();
});
