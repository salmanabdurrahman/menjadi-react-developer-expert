import { describe, expect, it } from 'vitest';

import { computeVoteState, getVoteScore, getVoteStatus } from '@/utils/vote';

describe('vote local state edge cases', () => {
  it('upvotes from neutral state', () => {
    expect(computeVoteState([], [], 'user-1', 1)).toEqual({
      downVotesBy: [],
      upVotesBy: ['user-1'],
    });
  });

  it('downvotes from neutral state', () => {
    expect(computeVoteState([], [], 'user-1', -1)).toEqual({
      downVotesBy: ['user-1'],
      upVotesBy: [],
    });
  });

  it('neutralizes existing upvote', () => {
    expect(computeVoteState(['user-1'], [], 'user-1', 1)).toEqual({
      downVotesBy: [],
      upVotesBy: [],
    });
  });

  it('neutralizes existing downvote', () => {
    expect(computeVoteState([], ['user-1'], 'user-1', -1)).toEqual({
      downVotesBy: [],
      upVotesBy: [],
    });
  });

  it('switches upvote to downvote without duplicate user id', () => {
    expect(computeVoteState(['user-1', 'user-2'], [], 'user-1', -1)).toEqual({
      downVotesBy: ['user-1'],
      upVotesBy: ['user-2'],
    });
  });

  it('switches downvote to upvote without duplicate user id', () => {
    expect(computeVoteState([], ['user-1', 'user-2'], 'user-1', 1)).toEqual({
      downVotesBy: ['user-2'],
      upVotesBy: ['user-1'],
    });
  });

  it('returns neutral status when user id is missing', () => {
    expect(getVoteStatus(['user-1'], ['user-2'], undefined)).toBe(0);
  });

  it('computes score from missing-like empty arrays', () => {
    expect(getVoteScore([], [])).toBe(0);
  });
});
