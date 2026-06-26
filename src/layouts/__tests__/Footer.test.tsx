import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Footer } from '@/layouts/Footer';

describe('Footer', () => {
  it('renders app name and tech stack note', () => {
    render(<Footer />);

    expect(screen.getByText('Forum Diskusi')).toBeInTheDocument();
    expect(
      screen.getByText('Dibangun dengan React, Redux, Vite, dan shadcn/ui.'),
    ).toBeInTheDocument();
  });
});
