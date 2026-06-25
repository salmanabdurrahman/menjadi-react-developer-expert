export type ApiStatus = 'success' | 'fail';

export interface ApiResponse<T> {
  status: ApiStatus;
  message: string;
  data: T;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Thread {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  ownerId: string;
  upVotesBy: string[];
  downVotesBy: string[];
  totalComments: number;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  owner: User;
  upVotesBy: string[];
  downVotesBy: string[];
}

export interface ThreadDetail extends Omit<Thread, 'ownerId' | 'totalComments'> {
  owner: User;
  comments: Comment[];
}

export interface LeaderboardItem {
  user: User;
  score: number;
}

export type VoteType = -1 | 0 | 1;
