import type { VoteType } from '@/types/api';

export interface VoteState {
  downVotesBy: string[];
  upVotesBy: string[];
}

export function getVoteScore(upVotesBy: string[], downVotesBy: string[]) {
  return upVotesBy.length - downVotesBy.length;
}

export const getVoteCount = getVoteScore;

export function getVoteStatus(
  upVotesBy: string[],
  downVotesBy: string[],
  userId: string | undefined,
): VoteType {
  if (!userId) {
    return 0;
  }

  if (upVotesBy.includes(userId)) {
    return 1;
  }

  if (downVotesBy.includes(userId)) {
    return -1;
  }

  return 0;
}

export function getNextVoteAction(currentStatus: VoteType, clickedType: VoteType): VoteType {
  if (clickedType === 0) {
    return 0;
  }

  if (currentStatus === clickedType) {
    return 0;
  }

  return clickedType;
}

export function computeVoteState(
  upVotesBy: string[],
  downVotesBy: string[],
  userId: string,
  action: VoteType,
): VoteState {
  const currentStatus = getVoteStatus(upVotesBy, downVotesBy, userId);
  const nextAction = getNextVoteAction(currentStatus, action);

  const nextUpVotesBy = upVotesBy.filter((voterId) => voterId !== userId);
  const nextDownVotesBy = downVotesBy.filter((voterId) => voterId !== userId);

  if (nextAction === 1) {
    nextUpVotesBy.push(userId);
  }

  if (nextAction === -1) {
    nextDownVotesBy.push(userId);
  }

  return {
    downVotesBy: nextDownVotesBy,
    upVotesBy: nextUpVotesBy,
  };
}
