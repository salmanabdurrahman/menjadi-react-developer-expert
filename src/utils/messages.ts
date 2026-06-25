const INDONESIAN_MESSAGE_PATTERN =
  /\b(anda|atau|berhasil|data|daftar|dapat|diproses|ditemukan|gagal|isi|kata sandi|komentar|masuk|papan peringkat|pengguna|permintaan|sesi|sudah|thread|tidak|vote|wajib)\b/i;

const MESSAGE_MAP: Array<[RegExp, string]> = [
  [/^ok$/i, 'Berhasil.'],
  [/^success$/i, 'Berhasil.'],
  [/user created/i, 'Pengguna berhasil dibuat.'],
  [/user logged in/i, 'Pengguna berhasil masuk.'],
  [/user fetched/i, 'Data pengguna berhasil dimuat.'],
  [/threads fetched/i, 'Daftar thread berhasil dimuat.'],
  [/thread fetched/i, 'Thread berhasil dimuat.'],
  [/thread created/i, 'Thread berhasil dibuat.'],
  [/comment created/i, 'Komentar berhasil dibuat.'],
  [/leaderboards fetched/i, 'Papan peringkat berhasil dimuat.'],
  [/thread up voted/i, 'Thread berhasil diberi upvote.'],
  [/thread down voted/i, 'Thread berhasil diberi downvote.'],
  [/thread neutral voted/i, 'Vote thread berhasil dinetralkan.'],
  [/comment up voted/i, 'Komentar berhasil diberi upvote.'],
  [/comment down voted/i, 'Komentar berhasil diberi downvote.'],
  [/comment neutral voted/i, 'Vote komentar berhasil dinetralkan.'],
  [/email is already taken/i, 'Email sudah digunakan.'],
  [/email or password is wrong/i, 'Email atau kata sandi salah.'],
  [/title is required/i, 'Judul wajib diisi.'],
  [/body is required/i, 'Isi wajib diisi.'],
  [/content is required/i, 'Komentar wajib diisi.'],
  [/failed to fetch/i, 'Tidak dapat terhubung ke server. Periksa koneksi Anda.'],
  [/network error/i, 'Tidak dapat terhubung ke server. Periksa koneksi Anda.'],
  [/unauthorized/i, 'Sesi tidak valid.'],
  [/token invalid/i, 'Sesi tidak valid.'],
  [/invalid response/i, 'Respons API tidak valid.'],
  [/bad request/i, 'Permintaan tidak valid.'],
  [/thread not found/i, 'Thread tidak ditemukan.'],
  [/comment not found/i, 'Komentar tidak ditemukan.'],
  [/not found/i, 'Data tidak ditemukan.'],
  [/request failed/i, 'Permintaan gagal diproses.'],
];

export function toIndonesianMessage(message: string, fallback: string) {
  const trimmedMessage = message.trim();

  for (const [pattern, translated] of MESSAGE_MAP) {
    if (pattern.test(trimmedMessage)) {
      return translated;
    }
  }

  if (INDONESIAN_MESSAGE_PATTERN.test(trimmedMessage)) {
    return trimmedMessage;
  }

  return fallback;
}
