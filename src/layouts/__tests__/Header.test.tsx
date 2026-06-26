import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { Header } from '@/layouts/Header';

describe('Header', () => {
  it('renders guest navigation and auth links', () => {
    render(
      <MemoryRouter initialEntries={['/leaderboards']}>
        <Header isAuthenticated={false} onLogout={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Forum Diskusi' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('navigation', { name: 'Navigasi utama' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Buat Thread' })).toHaveAttribute(
      'href',
      '/threads/new',
    );
    expect(screen.getByRole('link', { name: 'Masuk' })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: 'Daftar' })).toHaveAttribute('href', '/register');
  });

  it('renders authenticated user and calls logout', () => {
    const onLogout = vi.fn();

    render(
      <MemoryRouter>
        <Header isAuthenticated onLogout={onLogout} userName="Budi" />
      </MemoryRouter>,
    );

    expect(screen.getAllByText('Budi')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Keluar' }));

    expect(onLogout).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('link', { name: 'Masuk' })).not.toBeInTheDocument();
  });

  it('uses fallback user name when authenticated user name missing', () => {
    render(
      <MemoryRouter>
        <Header isAuthenticated onLogout={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.getAllByText('Pengguna forum')).toHaveLength(2);
  });
});
