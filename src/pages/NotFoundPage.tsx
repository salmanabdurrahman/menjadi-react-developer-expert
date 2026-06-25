import { Link } from 'react-router-dom';

import { ErrorState, buttonVariants } from '@/components/ui';

export function NotFoundPage() {
  return (
    <section className="container-responsive grid gap-4 py-10 md:py-14">
      <ErrorState
        message="Halaman yang Anda cari tidak tersedia."
        title="Halaman tidak ditemukan"
      />
      <Link
        className={buttonVariants({
          className: 'justify-self-center',
          variant: 'outline',
        })}
        to="/"
      >
        Kembali ke beranda
      </Link>
    </section>
  );
}
