import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CommentList } from '@/components/comments/CommentList';

vi.mock('@/components/comments/CommentCard', () => ({
  CommentCard: ({ comment }: { comment: { content: string } }) => (
    <article>{comment.content}</article>
  ),
}));

describe('CommentList', () => {
  it('shows empty state when no comments', () => {
    render(<CommentList comments={[]} threadId="thread-1" />);

    expect(screen.getByText('Belum ada komentar. Jadilah yang pertama.')).toBeInTheDocument();
  });

  it('renders comment cards', () => {
    render(
      <CommentList
        comments={[
          {
            content: 'Komentar 1',
            createdAt: '2026-06-25T00:00:00.000Z',
            downVotesBy: [],
            id: 'c1',
            owner: { avatar: '', email: '', id: 'u1', name: 'Budi' },
            upVotesBy: [],
          },
        ]}
        threadId="thread-1"
      />,
    );

    expect(screen.getByText('Komentar 1')).toBeInTheDocument();
  });
});
