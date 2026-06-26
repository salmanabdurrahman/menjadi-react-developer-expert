import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { NotFoundPage } from '@/pages/NotFoundPage';

describe('NotFoundPage', () => {
  it('renders not found message and back home link', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Halaman tidak ditemukan')).toBeInTheDocument();
    expect(screen.getByText('Halaman yang Anda cari tidak tersedia.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Kembali ke beranda' })).toHaveAttribute('href', '/');
  });
});
