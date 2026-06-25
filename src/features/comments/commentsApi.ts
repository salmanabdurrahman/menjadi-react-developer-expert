import { apiClient } from '@/services/apiClient';
import type { Comment } from '@/types/api';

interface CreateCommentPayload {
  content: string;
}

interface CreateCommentResponse {
  comment: Comment;
}

export function createComment(threadId: string, payload: CreateCommentPayload) {
  return apiClient<CreateCommentResponse>(`/threads/${threadId}/comments`, {
    body: payload,
    method: 'POST',
  });
}
