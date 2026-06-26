import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ThreadDetailHeader } from '@/components/threads/ThreadDetailHeader';
import { makeThreadDetail, makeUser } from '@/test/factories';

describe('ThreadDetailHeader', () => {
  it('renders category, title, owner, and relative date', () => {
    render(
      <ThreadDetailHeader
        thread={makeThreadDetail({
          category: 'Redux',
          createdAt: '2026-06-25T11:55:00.000Z',
          owner: makeUser({ name: 'Sinta' }),
          title: 'Memahami Redux Toolkit',
        })}
      />,
    );

    expect(screen.getByText('Redux')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Memahami Redux Toolkit' })).toBeInTheDocument();
    expect(screen.getByText('Oleh Sinta')).toBeInTheDocument();
    expect(screen.getByText(/yang lalu|baru saja|kemarin/)).toBeInTheDocument();
  });
});
