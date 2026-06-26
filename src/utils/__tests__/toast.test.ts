import { toast } from 'sonner';
import { describe, expect, it, vi } from 'vitest';

import { showErrorToast, showSuccessToast } from '@/utils/toast';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('toast utilities with Sonner integration', () => {
  it('shows Indonesian success feedback through Sonner', () => {
    showSuccessToast('created', 'Berhasil menyimpan data.');

    expect(toast.success).toHaveBeenCalledWith('Berhasil menyimpan data.');
  });

  it('shows Indonesian error feedback through Sonner', () => {
    showErrorToast(new Error('Failed to fetch'), 'Gagal memuat data.');

    expect(toast.error).toHaveBeenCalledWith(
      'Tidak dapat terhubung ke server. Periksa koneksi Anda.',
    );
  });

  it('uses fallback when value has no readable message', () => {
    showErrorToast(null, 'Terjadi kesalahan.');

    expect(toast.error).toHaveBeenCalledWith('Terjadi kesalahan.');
  });
});
