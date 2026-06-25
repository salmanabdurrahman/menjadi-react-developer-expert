import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { ThreadDetailPage } from '@/pages/ThreadDetailPage';

const dispatchMock = vi.fn();
const selectorState = {
  detailState: {
    commentError: null as string | null,
    commentStatus: 'idle',
    error: null as string | null,
    notFound: false,
    status: 'succeeded',
  },
  thread: {
    body: '<p>Isi detail</p>',
    category: 'React',
    comments: [],
    createdAt: '2026-06-25T00:00:00.000Z',
    downVotesBy: [],
    id: 'thread-1',
    owner: { avatar: '', email: '', id: 'user-1', name: 'Budi' },
    title: 'Detail React',
    upVotesBy: [],
  },
};

vi.mock('@/hooks', () => ({
  useAppDispatch: () => dispatchMock,
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({ auth: { authedUser: null } }),
}));

vi.mock('@/components/comments', () => ({
  CommentForm: () => <form>Form komentar</form>,
  CommentList: () => <div>Daftar komentar</div>,
}));

vi.mock('@/components/threads', () => ({
  ThreadContent: ({ thread }: { thread: { body: string } }) => <article>{thread.body}</article>,
  ThreadDetailHeader: ({ thread }: { thread: { title: string } }) => <h1>{thread.title}</h1>,
}));

vi.mock('@/store/slices/threadDetailSlice', () => ({
  clearThreadDetail: () => ({ type: 'detail/clear' }),
  fetchThreadDetail: (threadId: string) => ({
    payload: threadId,
    type: 'detail/fetch',
  }),
  selectThreadDetail: () => selectorState.thread,
  selectThreadDetailState: () => selectorState.detailState,
  submitComment: () => ({ type: 'detail/comment' }),
}));

function renderPage() {
  render(
    <MemoryRouter initialEntries={['/threads/thread-1']}>
      <Routes>
        <Route path="/threads/:threadId" element={<ThreadDetailPage />} />
        <Route path="/" element={<p>Beranda</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ThreadDetailPage integration', () => {
  beforeEach(() => {
    dispatchMock.mockReset();
    selectorState.detailState = {
      commentError: null,
      commentStatus: 'idle',
      error: null,
      notFound: false,
      status: 'succeeded',
    };
  });

  test('renders detail, comments, and guest prompt from store', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Detail React' })).toBeInTheDocument();
    expect(screen.getByText('Daftar komentar')).toBeInTheDocument();
    expect(screen.getByText('Masuk dulu untuk menulis komentar.')).toBeInTheDocument();
  });

  test('renders not found state', () => {
    selectorState.detailState = {
      commentError: null,
      commentStatus: 'idle',
      error: null,
      notFound: true,
      status: 'failed',
    };

    renderPage();

    expect(screen.getByText('Thread tidak ditemukan')).toBeInTheDocument();
  });
});
