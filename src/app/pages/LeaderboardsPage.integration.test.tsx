import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { LeaderboardsPage } from '@/app/pages/LeaderboardsPage';

const dispatchMock = vi.fn();
const leaderboardsState = {
  error: null as string | null,
  items: [
    {
      score: 30,
      user: {
        avatar: '',
        email: 'siti@example.com',
        id: 'user-1',
        name: 'Siti',
      },
    },
    {
      score: 20,
      user: {
        avatar: '',
        email: 'budi@example.com',
        id: 'user-2',
        name: 'Budi',
      },
    },
  ],
  status: 'succeeded',
};

vi.mock('@/hooks', () => ({
  useAppDispatch: () => dispatchMock,
  useAppSelector: (selector: (state: unknown) => unknown) => selector({}),
}));

vi.mock('@/features/leaderboards', () => ({
  fetchLeaderboards: () => ({ type: 'leaderboards/fetch' }),
  selectLeaderboardsState: () => leaderboardsState,
}));

describe('LeaderboardsPage integration', () => {
  beforeEach(() => {
    dispatchMock.mockReset();
    leaderboardsState.error = null;
    leaderboardsState.status = 'succeeded';
    leaderboardsState.items = [
      {
        score: 30,
        user: {
          avatar: '',
          email: 'siti@example.com',
          id: 'user-1',
          name: 'Siti',
        },
      },
      {
        score: 20,
        user: {
          avatar: '',
          email: 'budi@example.com',
          id: 'user-2',
          name: 'Budi',
        },
      },
    ];
  });

  test('renders leaderboard rows from store', () => {
    render(<LeaderboardsPage />);

    expect(screen.getByRole('heading', { name: 'Kontributor Terbaik' })).toBeInTheDocument();
    expect(screen.getByText('Siti')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Budi')).toBeInTheDocument();
  });

  test('renders empty state from store', () => {
    leaderboardsState.items = [];

    render(<LeaderboardsPage />);

    expect(screen.getByText('Belum ada data leaderboard untuk ditampilkan.')).toBeInTheDocument();
  });
});
