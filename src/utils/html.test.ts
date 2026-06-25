import { describe, expect, it } from 'vitest';

import { sanitizeHtml } from '@/utils/html';

describe('sanitizeHtml', () => {
  it('removes blocked tags and dangerous attributes', () => {
    const sanitized = sanitizeHtml(
      '<p onclick="alert(1)">Halo</p><script>alert(1)</script><a href="javascript:alert(1)">tautan</a>',
    );

    expect(sanitized).toContain('<p>Halo</p>');
    expect(sanitized).toContain('<a>tautan</a>');
    expect(sanitized).not.toContain('script');
    expect(sanitized).not.toContain('onclick');
    expect(sanitized).not.toContain('javascript:');
  });
});
