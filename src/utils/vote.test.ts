import { describe, expect, it } from 'vitest';

import { computeVoteState, getNextVoteAction, getVoteScore, getVoteStatus } from '@/utils/vote';

describe('vote utils', () => {
  it('getVoteScore returns difference between up and down votes', () => {
    expect(getVoteScore(['u1', 'u2'], ['u3'])).toBe(1);
  });

  it('getVoteScore returns zero for balanced votes', () => {
    expect(getVoteScore(['u1'], ['u2'])).toBe(0);
  });

  it('getVoteStatus returns neutral without user id', () => {
    expect(getVoteStatus(['u1'], ['u2'], undefined)).toBe(0);
  });

  it('getVoteStatus returns up vote when user voted up', () => {
    expect(getVoteStatus(['u1'], ['u2'], 'u1')).toBe(1);
  });

  it('getVoteStatus returns down vote when user voted down', () => {
    expect(getVoteStatus(['u1'], ['u2'], 'u2')).toBe(-1);
  });

  it('getVoteStatus returns neutral when user not in lists', () => {
    expect(getVoteStatus(['u1'], ['u2'], 'u3')).toBe(0);
  });

  it('getNextVoteAction turns same up vote into neutral', () => {
    expect(getNextVoteAction(1, 1)).toBe(0);
  });

  it('getNextVoteAction turns same down vote into neutral', () => {
    expect(getNextVoteAction(-1, -1)).toBe(0);
  });

  it('getNextVoteAction keeps neutral when clicked neutral', () => {
    expect(getNextVoteAction(1, 0)).toBe(0);
  });

  it('getNextVoteAction switches neutral to up', () => {
    expect(getNextVoteAction(0, 1)).toBe(1);
  });

  it('getNextVoteAction switches neutral to down', () => {
    expect(getNextVoteAction(0, -1)).toBe(-1);
  });

  it('getNextVoteAction switches up to down', () => {
    expect(getNextVoteAction(1, -1)).toBe(-1);
  });

  it('getNextVoteAction switches down to up', () => {
    expect(getNextVoteAction(-1, 1)).toBe(1);
  });

  it('computeVoteState adds up vote for neutral user', () => {
    expect(computeVoteState(['u2'], ['u3'], 'u1', 1)).toEqual({
      downVotesBy: ['u3'],
      upVotesBy: ['u2', 'u1'],
    });
  });

  it('computeVoteState adds down vote for neutral user', () => {
    expect(computeVoteState(['u2'], ['u3'], 'u1', -1)).toEqual({
      downVotesBy: ['u3', 'u1'],
      upVotesBy: ['u2'],
    });
  });

  it('computeVoteState removes own up vote when clicked up again', () => {
    expect(computeVoteState(['u1', 'u2'], ['u3'], 'u1', 1)).toEqual({
      downVotesBy: ['u3'],
      upVotesBy: ['u2'],
    });
  });

  it('computeVoteState removes own down vote when clicked down again', () => {
    expect(computeVoteState(['u2'], ['u1', 'u3'], 'u1', -1)).toEqual({
      downVotesBy: ['u3'],
      upVotesBy: ['u2'],
    });
  });

  it('computeVoteState switches up vote to down vote', () => {
    expect(computeVoteState(['u1', 'u2'], ['u3'], 'u1', -1)).toEqual({
      downVotesBy: ['u3', 'u1'],
      upVotesBy: ['u2'],
    });
  });

  it('computeVoteState switches down vote to up vote', () => {
    expect(computeVoteState(['u2'], ['u1', 'u3'], 'u1', 1)).toEqual({
      downVotesBy: ['u3'],
      upVotesBy: ['u2', 'u1'],
    });
  });

  it('computeVoteState returns same lists for neutral click', () => {
    expect(computeVoteState(['u2'], ['u3'], 'u1', 0)).toEqual({
      downVotesBy: ['u3'],
      upVotesBy: ['u2'],
    });
  });
});
