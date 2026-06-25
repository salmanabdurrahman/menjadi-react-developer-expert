import { apiClient } from '@/services/apiClient';
import type { LeaderboardItem } from '@/types/api';

interface LeaderboardsResponse {
  leaderboards: LeaderboardItem[];
}

export function getLeaderboards() {
  return apiClient<LeaderboardsResponse>('/leaderboards');
}
