import { describe, expect, it } from 'vitest';

import { stripHtml, truncateHtml, truncateText } from '@/utils/text';

describe('text utils', () => {
  it('stripHtml removes tags', () => {
    expect(stripHtml('<p>Halo <strong>dunia</strong></p>')).toBe('Halo dunia');
  });

  it('stripHtml collapses whitespace', () => {
    expect(stripHtml('<p>Halo</p>\n\n<p>dunia</p>')).toBe('Halo dunia');
  });

  it('stripHtml trims leading and trailing spaces', () => {
    expect(stripHtml('  <div>  Halo  </div>  ')).toBe('Halo');
  });

  it('truncateText returns short text unchanged', () => {
    expect(truncateText('Halo', 10)).toBe('Halo');
  });

  it('truncateText keeps exact max length unchanged', () => {
    expect(truncateText('12345', 5)).toBe('12345');
  });

  it('truncateText shortens long text with ellipsis', () => {
    expect(truncateText('1234567890', 5)).toBe('1234…');
  });

  it('truncateText trims long text before ellipsis', () => {
    expect(truncateText('Halo dunia luas', 10)).toBe('Halo duni…');
  });

  it('truncateHtml strips then truncates html content', () => {
    expect(truncateHtml('<p>Halo <strong>dunia</strong> luas</p>', 10)).toBe('Halo duni…');
  });
});
