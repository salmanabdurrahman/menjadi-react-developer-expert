# Forum Discussion App

Aplikasi forum diskusi modern berbasis **React + TypeScript** yang memakai **Dicoding Forum API**. Project ini dibuat sebagai implementasi frontend untuk alur forum end-to-end: autentikasi, daftar thread, detail diskusi, komentar, voting, leaderboard, route protection, dan quality assurance dengan unit/integration test.

Live demo tersedia di: https://menjadi-react-developer-expert.netlify.app/

## Ringkasan Project

Forum Discussion App membantu pengguna membaca dan mengikuti diskusi publik. Pengguna dapat membuat akun, login, membuat thread, memberi komentar, memberi vote pada thread/komentar, memfilter thread berdasarkan kategori, serta melihat leaderboard pengguna paling aktif.

Kode disusun modular per fitur agar mudah dirawat, diuji, dan dikembangkan. State async dikelola lewat Redux Toolkit thunk, akses HTTP dipusatkan di API client, sedangkan halaman fokus pada orkestrasi UI dan state form lokal.

## Fitur Utama

- **Autentikasi pengguna**: registrasi, login, logout, penyimpanan token, dan pemuatan profil pengguna aktif.
- **Daftar thread**: menampilkan thread forum, owner, kategori, jumlah komentar, vote, dan waktu relatif.
- **Filter kategori**: memfilter thread berdasarkan kategori yang tersedia dari data thread.
- **Detail thread**: menampilkan konten thread lengkap, metadata, komentar, dan aksi voting.
- **Buat thread**: form protected untuk membuat diskusi baru.
- **Komentar**: pengguna terautentikasi dapat menambahkan komentar pada thread.
- **Voting**: upvote/downvote/neutral vote untuk thread dan komentar.
- **Leaderboard**: daftar skor pengguna berdasarkan aktivitas forum.
- **Protected route**: halaman tertentu hanya dapat diakses setelah login.
- **State feedback**: loading, empty state, error state, dan toast notification.
- **Responsive UI**: layout adaptif dengan Tailwind CSS.
- **Test coverage**: unit test dan integration test untuk service, util, slice, komponen, route, dan halaman penting.

## Tech Stack

- **React 19** — library UI utama.
- **TypeScript** — type safety untuk komponen, service, dan state.
- **Vite** — dev server dan build tool.
- **Redux Toolkit + React Redux** — state management dan async thunk.
- **React Router** — routing dan protected page.
- **Tailwind CSS v4** — styling utility-first.
- **Base UI, shadcn utilities, CVA, clsx, tailwind-merge** — fondasi komponen UI.
- **Sonner** — toast notification.
- **Vitest + React Testing Library** — unit dan integration testing.
- **ESLint + Prettier** — linting dan format code.
- **Bun** — package manager dan runner script.

## Struktur Folder

```text
src/
├── app/                 # store, router, protected route, halaman aplikasi
│   └── pages/           # halaman: thread list, detail, create, auth, leaderboard
├── components/          # komponen layout dan UI reusable
│   ├── layout/
│   └── ui/
├── config/              # konfigurasi environment
├── features/            # domain feature: auth, threads, comments, votes, leaderboards
├── hooks/               # typed Redux hooks
├── services/            # API client dan token storage
├── styles/              # global CSS
├── test/                # setup test
├── types/               # tipe API dan domain
└── utils/               # helper date, html, message, text, vote, toast
```

## Arsitektur Singkat

- `src/services/apiClient.ts` menjadi pintu utama komunikasi HTTP ke Dicoding Forum API.
- `src/services/tokenStorage.ts` mengelola token autentikasi di storage lokal.
- `src/features/*` berisi API wrapper, Redux slice, thunk, komponen domain, dan test per fitur.
- `src/app/router.tsx` mendefinisikan route aplikasi.
- `src/app/RequireAuth.tsx` menjaga halaman protected.
- `src/components/ui` menyediakan komponen UI reusable seperti button, card, input, textarea, badge, avatar, loading, empty, dan error state.
- `src/utils` menyimpan helper murni yang mudah diuji.

## Halaman Aplikasi

- `/` — daftar thread dan filter kategori.
- `/threads/:threadId` — detail thread, komentar, dan voting.
- `/threads/new` — buat thread baru, butuh login.
- `/leaderboards` — leaderboard pengguna.
- `/login` — login pengguna.
- `/register` — registrasi pengguna.
- `*` — halaman 404.

## API

Aplikasi memakai Dicoding Forum API dengan base URL:

```text
https://forum-api.dicoding.dev/v1
```

Base URL dikonfigurasi lewat `src/config/env.ts`.

## Prasyarat

- Bun terpasang di sistem.
- Node.js kompatibel dengan Vite/React toolchain.
- Koneksi internet untuk mengakses Dicoding Forum API.

## Instalasi

```bash
bun install
```

## Menjalankan Development Server

```bash
bun run dev
```

Buka URL yang muncul di terminal, biasanya:

```text
http://localhost:5173
```

## Build Production

```bash
bun run build
```

## Preview Build

```bash
bun run preview
```

## Quality Check

```bash
bun run lint
bun run test
bun run test:coverage
bun run format:check
```

## Format Code

```bash
bun run format
```

## Script Tersedia

| Script                  | Fungsi                               |
| ----------------------- | ------------------------------------ |
| `bun run dev`           | Menjalankan dev server Vite.         |
| `bun run build`         | Type-check dan build production.     |
| `bun run preview`       | Preview hasil build production.      |
| `bun run lint`          | Menjalankan ESLint.                  |
| `bun run test`          | Menjalankan test sekali.             |
| `bun run test:watch`    | Menjalankan test watch mode.         |
| `bun run test:coverage` | Menjalankan test dengan coverage.    |
| `bun run format`        | Format seluruh file dengan Prettier. |
| `bun run format:check`  | Cek format tanpa mengubah file.      |

## Testing

Test mencakup:

- API client dan token storage.
- Redux slice dan thunk fitur.
- Komponen UI reusable.
- Komponen domain seperti thread card, comment card, form, vote button, dan category filter.
- Router dan protected route.
- Integration test halaman utama seperti thread list, detail thread, create thread, login/register, dan leaderboard.

Jalankan semua test:

```bash
bun run test
```

## Catatan Pengembangan

- Pertahankan akses network di layer `services` dan `features/*Api.ts`.
- Komponen halaman sebaiknya mengelola state UI/form lokal saja.
- Logic transformasi data lebih baik ditempatkan di slice, thunk, util, atau selector-like helper.
- Tambahkan test saat menambah perilaku baru, terutama untuk alur async, route protected, dan voting.
- Hindari hardcode token atau credential di source code.
