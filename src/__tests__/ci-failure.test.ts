import { describe, expect, it } from 'vitest';

describe('intentional CI failure', () => {
  it('fails while testing branch protection checks', () => {
    expect('branch-protection-check').toBe('failed-on-purpose');
  });
});
