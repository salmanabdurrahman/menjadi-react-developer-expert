import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThreadListPage } from '@/pages/ThreadListPage';

const dispatchMock = vi.fn();
const selectorState = {
  categories: ['React'],
  filteredThreads: [
    {
      body: '<p>Isi thread</p>',
      category: 'React',
      createdAt: '2026-06-25T00:00:00.000Z',
      downVotesBy: [],
      id: 'thread-1',
      owner: { avatar: '', email: '', id: 'user-1', name: 'Budi' },
      ownerId: 'user-1',
      title: 'Belajar React',
      totalComments: 0,
      upVotesBy: [],
    },
  ],
  selectedCategory: 'all',
  threadsState: {
    error: null as string | null,
    status: 'succeeded',
    threads: [{ id: 'thread-1' }],
  },
};

vi.mock('@/hooks', () => ({
  useAppDispatch: () => dispatchMock,
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({ auth: { authedUser: null } }),
}));

vi.mock('@/components/threads', () => ({
  CategoryFilter: ({ categories }: { categories: string[] }) => (
    <div>Kategori {categories.join(', ')}</div>
  ),
  ThreadCard: ({ thread }: { thread: { title: string } }) => <article>{thread.title}</article>,
}));

vi.mock('@/store/slices/threadsSlice', () => ({
  fetchThreads: () => ({ type: 'threads/fetch' }),
  selectCategories: () => selectorState.categories,
  selectCategory: (category: string) => ({
    payload: category,
    type: 'threads/select',
  }),
  selectFilteredThreads: () => selectorState.filteredThreads,
  selectSelectedCategory: () => selectorState.selectedCategory,
  selectThreadsState: () => selectorState.threadsState,
}));

describe('ThreadListPage integration', () => {
  beforeEach(() => {
    dispatchMock.mockReset();
    selectorState.threadsState = {
      error: null,
      status: 'succeeded',
      threads: [{ id: 'thread-1' }],
    };
    selectorState.filteredThreads = [
      {
        body: '<p>Isi thread</p>',
        category: 'React',
        createdAt: '2026-06-25T00:00:00.000Z',
        downVotesBy: [],
        id: 'thread-1',
        owner: { avatar: '', email: '', id: 'user-1', name: 'Budi' },
        ownerId: 'user-1',
        title: 'Belajar React',
        totalComments: 0,
        upVotesBy: [],
      },
    ];
  });

  it('renders hero, filters, and thread list from store', () => {
    render(
      <MemoryRouter>
        <ThreadListPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Thread Terbaru')).toBeInTheDocument();
    expect(screen.getByText('Kategori React')).toBeInTheDocument();
    expect(screen.getByText('Belajar React')).toBeInTheDocument();
  });

  it('renders empty state from store', () => {
    selectorState.filteredThreads = [];
    selectorState.threadsState = {
      error: null,
      status: 'succeeded',
      threads: [],
    };

    render(
      <MemoryRouter>
        <ThreadListPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByText('Belum ada thread. Jadilah pembuka diskusi pertama.'),
    ).toBeInTheDocument();
  });
});
