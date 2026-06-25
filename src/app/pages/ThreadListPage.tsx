import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  LoadingState,
  buttonVariants,
} from '@/components/ui';
import { CategoryFilter, ThreadCard } from '@/features/threads';
import {
  fetchThreads,
  selectCategories,
  selectCategory,
  selectFilteredThreads,
  selectSelectedCategory,
  selectThreadsState,
} from '@/features/threads/threadsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';

export function ThreadListPage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { authedUser } = useAppSelector((state) => state.auth);
  const { error, status, threads } = useAppSelector(selectThreadsState);
  const categories = useAppSelector(selectCategories);
  const filteredThreads = useAppSelector(selectFilteredThreads);
  const selectedCategory = useAppSelector(selectSelectedCategory);
  const categoryParam = searchParams.get('category');

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchThreads());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (status !== 'succeeded') {
      return;
    }

    const nextCategory =
      categoryParam && categories.includes(categoryParam) ? categoryParam : 'all';

    if (nextCategory !== selectedCategory) {
      dispatch(selectCategory(nextCategory));
    }
  }, [categories, categoryParam, dispatch, selectedCategory, status]);

  function handleCategorySelect(category: string) {
    dispatch(selectCategory(category));
    setSearchParams(category === 'all' ? {} : { category });
  }

  const shouldShowEmpty = status === 'succeeded' && threads.length === 0;
  const shouldShowEmptyFilter =
    status === 'succeeded' && threads.length > 0 && filteredThreads.length === 0;

  return (
    <section className="container-responsive grid gap-8 py-10 md:py-14">
      <Card as="section" className="overflow-hidden bg-muted/30">
        <CardHeader className="gap-6 p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Baca, komentar, vote thread komunitas.
            </span>
          </div>
          <div className="grid gap-4">
            <CardTitle className="max-w-3xl text-4xl leading-tight md:text-6xl">
              Diskusi, berbagi solusi, tumbuh bersama.
            </CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7 md:text-lg">
              Telusuri thread, baca jawaban komunitas, dan mulai diskusi baru dari satu tempat.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-3">
            {authedUser ? (
              <Link className={buttonVariants()} to="/threads/new">
                Buat Thread
              </Link>
            ) : (
              <>
                <Link className={buttonVariants()} to="/login">
                  Masuk untuk Buat Thread
                </Link>
                <Link className={buttonVariants({ variant: 'outline' })} to="/register">
                  Daftar Akun
                </Link>
              </>
            )}
            <Link className={buttonVariants({ variant: 'secondary' })} to="/leaderboards">
              Lihat Papan Peringkat
            </Link>
          </div>
        </CardHeader>
      </Card>

      <Card as="section">
        <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between md:space-y-0">
          <div className="grid gap-1">
            <CardTitle>Thread Terbaru</CardTitle>
            <CardDescription>Pilih kategori atau baca semua diskusi terbaru.</CardDescription>
          </div>
          <CategoryFilter
            categories={categories}
            onSelect={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
        </CardHeader>

        <CardContent className="grid gap-4">
          {status === 'loading' ? <LoadingState label="Memuat thread…" /> : null}
          {status === 'failed' ? (
            <ErrorState
              message={error ?? 'Thread gagal dimuat.'}
              onRetry={() => {
                void dispatch(fetchThreads());
              }}
            />
          ) : null}
          {shouldShowEmpty ? (
            <EmptyState message="Belum ada thread. Jadilah pembuka diskusi pertama." />
          ) : null}
          {shouldShowEmptyFilter ? (
            <EmptyState message="Belum ada thread pada kategori ini." />
          ) : null}
          {status === 'succeeded' && filteredThreads.length > 0 ? (
            <div className="grid gap-4">
              {filteredThreads.map((thread) => (
                <ThreadCard authedUserId={authedUser?.id} key={thread.id} thread={thread} />
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
