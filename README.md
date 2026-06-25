# Forum Discussion App

Aplikasi forum diskusi berbasis React + TypeScript yang terhubung ke Dicoding Forum API.

## Fitur

- Registrasi, login, dan logout akun
- Daftar thread dengan filter kategori
- Detail thread dan komentar
- Buat thread baru
- Buat komentar baru
- Voting thread dan komentar
- Leaderboard pengguna
- Loading, empty, dan error state
- Route protected untuk halaman butuh autentikasi

## Stack

- React 19
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS v4
- Vitest
- React Testing Library

## Persiapan

```bash
bun install
```

## Jalankan Dev Server

```bash
bun run dev
```

## Build Production

```bash
bun run build
```

## Quality Check

```bash
bun run lint
bun run test
bun run test:coverage
bun run format:check
```

## Format

```bash
bun run format
```

## API

Aplikasi memakai base URL:

```text
https://forum-api.dicoding.dev/v1
```

## Catatan Pengembangan

- Akses HTTP dipusatkan di `src/services/apiClient.ts`.
- Fetch/mutasi data halaman memakai Redux thunk di slice fitur; komponen halaman hanya mengelola state form lokal.
- Komponen UI reusable diimpor lewat barrel `src/components/ui`.
