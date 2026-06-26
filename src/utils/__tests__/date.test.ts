import { describe, expect, it } from 'vitest';

import { formatRelativeDate } from '@/utils/date';

describe('date utils', () => {
  const baseDate = new Date('2026-06-25T12:00:00.000Z');

  it('returns empty string for invalid date', () => {
    expect(formatRelativeDate('not-a-date', baseDate)).toBe('');
  });

  it('returns seconds ago', () => {
    expect(formatRelativeDate('2026-06-25T11:59:30.000Z', baseDate)).toBe('30 detik yang lalu');
  });

  it('returns minutes ago', () => {
    expect(formatRelativeDate('2026-06-25T11:55:00.000Z', baseDate)).toBe('5 menit yang lalu');
  });

  it('returns hours ago', () => {
    expect(formatRelativeDate('2026-06-25T10:00:00.000Z', baseDate)).toBe('2 jam yang lalu');
  });

  it('returns days ago', () => {
    expect(formatRelativeDate('2026-06-22T12:00:00.000Z', baseDate)).toBe('3 hari yang lalu');
  });

  it('returns months ago', () => {
    expect(formatRelativeDate('2026-04-25T12:00:00.000Z', baseDate)).toBe('2 bulan yang lalu');
  });

  it('returns years ago', () => {
    expect(formatRelativeDate('2025-06-25T12:00:00.000Z', baseDate)).toBe('tahun lalu');
  });
});
