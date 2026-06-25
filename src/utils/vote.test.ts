import { describe, expect, test } from 'vitest';

import { computeVoteState, getNextVoteAction, getVoteScore, getVoteStatus } from '@/utils/vote';

describe('vote utils', () => {
  test('getVoteScore returns difference between up and down votes', () => {
    expect(getVoteScore(['u1', 'u2'], ['u3'])).toBe(1);
  });

  test('getVoteScore returns zero for balanced votes', () => {
    expect(getVoteScore(['u1'], ['u2'])).toBe(0);
  });

  test('getVoteStatus returns neutral without user id', () => {
    expect(getVoteStatus(['u1'], ['u2'], undefined)).toBe(0);
  });

  test('getVoteStatus returns up vote when user voted up', () => {
    expect(getVoteStatus(['u1'], ['u2'], 'u1')).toBe(1);
  });

  test('getVoteStatus returns down vote when user voted down', () => {
    expect(getVoteStatus(['u1'], ['u2'], 'u2')).toBe(-1);
  });

  test('getVoteStatus returns neutral when user not in lists', () => {
    expect(getVoteStatus(['u1'], ['u2'], 'u3')).toBe(0);
  });

  test('getNextVoteAction turns same up vote into neutral', () => {
    expect(getNextVoteAction(1, 1)).toBe(0);
  });

  test('getNextVoteAction turns same down vote into neutral', () => {
    expect(getNextVoteAction(-1, -1)).toBe(0);
  });

  test('getNextVoteAction keeps neutral when clicked neutral', () => {
    expect(getNextVoteAction(1, 0)).toBe(0);
  });

  test('getNextVoteAction switches neutral to up', () => {
    expect(getNextVoteAction(0, 1)).toBe(1);
  });

  test('getNextVoteAction switches neutral to down', () => {
    expect(getNextVoteAction(0, -1)).toBe(-1);
  });

  test('getNextVoteAction switches up to down', () => {
    expect(getNextVoteAction(1, -1)).toBe(-1);
  });

  test('getNextVoteAction switches down to up', () => {
    expect(getNextVoteAction(-1, 1)).toBe(1);
  });

  test('computeVoteState adds up vote for neutral user', () => {
    expect(computeVoteState(['u2'], ['u3'], 'u1', 1)).toEqual({
      downVotesBy: ['u3'],
      upVotesBy: ['u2', 'u1'],
    });
  });

  test('computeVoteState adds down vote for neutral user', () => {
    expect(computeVoteState(['u2'], ['u3'], 'u1', -1)).toEqual({
      downVotesBy: ['u3', 'u1'],
      upVotesBy: ['u2'],
    });
  });

  test('computeVoteState removes own up vote when clicked up again', () => {
    expect(computeVoteState(['u1', 'u2'], ['u3'], 'u1', 1)).toEqual({
      downVotesBy: ['u3'],
      upVotesBy: ['u2'],
    });
  });

  test('computeVoteState removes own down vote when clicked down again', () => {
    expect(computeVoteState(['u2'], ['u1', 'u3'], 'u1', -1)).toEqual({
      downVotesBy: ['u3'],
      upVotesBy: ['u2'],
    });
  });

  test('computeVoteState switches up vote to down vote', () => {
    expect(computeVoteState(['u1', 'u2'], ['u3'], 'u1', -1)).toEqual({
      downVotesBy: ['u3', 'u1'],
      upVotesBy: ['u2'],
    });
  });

  test('computeVoteState switches down vote to up vote', () => {
    expect(computeVoteState(['u2'], ['u1', 'u3'], 'u1', 1)).toEqual({
      downVotesBy: ['u3'],
      upVotesBy: ['u2', 'u1'],
    });
  });

  test('computeVoteState returns same lists for neutral click', () => {
    expect(computeVoteState(['u2'], ['u3'], 'u1', 0)).toEqual({
      downVotesBy: ['u3'],
      upVotesBy: ['u2'],
    });
  });
});
