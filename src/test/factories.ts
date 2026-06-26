import type { Comment, LeaderboardItem, Thread, ThreadDetail, User } from '@/types/api';

export function makeUser(overrides: Partial<User> = {}): User {
  return {
    avatar: 'https://example.com/avatar.png',
    email: 'user@example.com',
    id: 'user-1',
    name: 'User Dicoding',
    ...overrides,
  };
}

export function makeThread(overrides: Partial<Thread> = {}): Thread {
  return {
    body: '<p>Isi thread</p>',
    category: 'React',
    createdAt: '2024-01-01T00:00:00.000Z',
    downVotesBy: [],
    id: 'thread-1',
    ownerId: 'user-1',
    title: 'Thread React',
    totalComments: 0,
    upVotesBy: [],
    ...overrides,
  };
}

export function makeComment(overrides: Partial<Comment> = {}): Comment {
  return {
    content: '<p>Komentar</p>',
    createdAt: '2024-01-02T00:00:00.000Z',
    downVotesBy: [],
    id: 'comment-1',
    owner: makeUser(),
    upVotesBy: [],
    ...overrides,
  };
}

export function makeThreadDetail(overrides: Partial<ThreadDetail> = {}): ThreadDetail {
  return {
    body: '<p>Isi lengkap thread</p>',
    category: 'React',
    comments: [makeComment()],
    createdAt: '2024-01-01T00:00:00.000Z',
    downVotesBy: [],
    id: 'thread-1',
    owner: makeUser(),
    title: 'Thread React',
    upVotesBy: [],
    ...overrides,
  };
}

export function makeLeaderboardItem(overrides: Partial<LeaderboardItem> = {}): LeaderboardItem {
  return {
    score: 10,
    user: makeUser(),
    ...overrides,
  };
}
