import { apiClient } from '@/services/apiClient';
import type { Thread, ThreadDetail, User } from '@/types/api';

interface ThreadsResponse {
  threads: Thread[];
}

interface UsersResponse {
  users: User[];
}

interface ThreadDetailResponse {
  detailThread: ThreadDetail;
}

interface CreateThreadPayload {
  title: string;
  body: string;
  category: string;
}

interface CreateThreadResponse {
  thread: Thread;
}

export function getThreads() {
  return apiClient<ThreadsResponse>('/threads');
}

export function getUsers() {
  return apiClient<UsersResponse>('/users');
}

export function getThreadDetail(threadId: string) {
  return apiClient<ThreadDetailResponse>(`/threads/${threadId}`);
}

export function createThread(payload: CreateThreadPayload) {
  return apiClient<CreateThreadResponse>('/threads', {
    body: payload,
    method: 'POST',
  });
}
