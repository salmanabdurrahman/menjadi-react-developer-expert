import { describe, expect, test } from 'vitest';

import { toIndonesianMessage } from '@/utils/messages';

describe('toIndonesianMessage', () => {
  test.each([
    ['ok', 'Berhasil.'],
    ['User created', 'Pengguna berhasil dibuat.'],
    ['User logged in', 'Pengguna berhasil masuk.'],
    ['User fetched', 'Data pengguna berhasil dimuat.'],
    ['Threads fetched', 'Daftar thread berhasil dimuat.'],
    ['Thread fetched', 'Thread berhasil dimuat.'],
    ['Thread created', 'Thread berhasil dibuat.'],
    ['Comment created', 'Komentar berhasil dibuat.'],
    ['Leaderboards fetched', 'Papan peringkat berhasil dimuat.'],
    ['Thread up voted', 'Thread berhasil diberi upvote.'],
    ['Thread down voted', 'Thread berhasil diberi downvote.'],
    ['Thread neutral voted', 'Vote thread berhasil dinetralkan.'],
    ['Comment up voted', 'Komentar berhasil diberi upvote.'],
    ['Comment down voted', 'Komentar berhasil diberi downvote.'],
    ['Comment neutral voted', 'Vote komentar berhasil dinetralkan.'],
    ['email is already taken', 'Email sudah digunakan.'],
    ['email or password is wrong', 'Email atau kata sandi salah.'],
    ['Token invalid', 'Sesi tidak valid.'],
    ['Thread not found', 'Thread tidak ditemukan.'],
    ['Comment not found', 'Komentar tidak ditemukan.'],
  ])('maps %s to Indonesian message', (message, expected) => {
    expect(toIndonesianMessage(message, 'Fallback.')).toBe(expected);
  });

  test('keeps Indonesian message from API', () => {
    expect(toIndonesianMessage('Thread tidak ditemukan', 'Fallback.')).toBe(
      'Thread tidak ditemukan',
    );
  });

  test('keeps unknown English message from leaking to UI', () => {
    expect(toIndonesianMessage('Something went wrong', 'Permintaan gagal diproses.')).toBe(
      'Permintaan gagal diproses.',
    );
  });

  test('uses fallback when message is empty', () => {
    expect(toIndonesianMessage('   ', 'Fallback.')).toBe('Fallback.');
  });
});
