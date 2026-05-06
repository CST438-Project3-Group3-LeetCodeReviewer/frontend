/**
 * Carries the just-submitted source from the problem screen into the feedback route
 * so the editor can show it immediately (same JS session). Server fetch still
 * reconciles as source of truth; clear after a successful load.
 */
const handoffBySubmissionId = new Map<string, string>();

export function stashFeedbackCodeForReview(submissionId: string, code: string): void {
  handoffBySubmissionId.set(submissionId, code);
}

export function peekFeedbackCodeHandoff(submissionId: string): string | undefined {
  return handoffBySubmissionId.get(submissionId);
}

export function clearFeedbackCodeHandoff(submissionId: string): void {
  handoffBySubmissionId.delete(submissionId);
}
