import { apiClient } from '@/services/apiClient';
import type { VoteType } from '@/types/api';

interface VoteResponse {
  voteType: VoteType;
}

function voteThread(threadId: string, action: 'up-vote' | 'down-vote' | 'neutral-vote') {
  return apiClient<VoteResponse>(`/threads/${threadId}/${action}`, {
    method: 'POST',
  });
}

function voteComment(
  threadId: string,
  commentId: string,
  action: 'up-vote' | 'down-vote' | 'neutral-vote',
) {
  return apiClient<VoteResponse>(`/threads/${threadId}/comments/${commentId}/${action}`, {
    method: 'POST',
  });
}

export function upVoteThread(threadId: string) {
  return voteThread(threadId, 'up-vote');
}

export function downVoteThread(threadId: string) {
  return voteThread(threadId, 'down-vote');
}

export function neutralVoteThread(threadId: string) {
  return voteThread(threadId, 'neutral-vote');
}

export function upVoteComment(threadId: string, commentId: string) {
  return voteComment(threadId, commentId, 'up-vote');
}

export function downVoteComment(threadId: string, commentId: string) {
  return voteComment(threadId, commentId, 'down-vote');
}

export function neutralVoteComment(threadId: string, commentId: string) {
  return voteComment(threadId, commentId, 'neutral-vote');
}
