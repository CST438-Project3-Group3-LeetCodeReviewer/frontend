import { formatElapsedTime, getProblemById } from './problemHelpers';

// Jest unit tests for shared problem detail helpers.
// Verifies problem lookup results and timer formatting output.
describe('problemHelpers', () => {
  describe('getProblemById', () => {
    it('returns the matching problem when a valid id is provided', () => {
      const problem = getProblemById('two-sum');

      expect(problem).toBeDefined();
      expect(problem?.id).toBe('two-sum');
      expect(problem?.title).toBe('Two Sum');
    });

    it('returns undefined when the problem id does not exist', () => {
      const problem = getProblemById('not-a-real-problem');

      expect(problem).toBeUndefined();
    });
  });

  describe('formatElapsedTime', () => {
    it('formats seconds into hh:mm:ss', () => {
      expect(formatElapsedTime(0)).toBe('00:00:00');
      expect(formatElapsedTime(26)).toBe('00:00:26');
      expect(formatElapsedTime(65)).toBe('00:01:05');
      expect(formatElapsedTime(3661)).toBe('01:01:01');
    });
  });
});