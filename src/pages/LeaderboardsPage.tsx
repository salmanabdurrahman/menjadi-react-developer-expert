import { useEffect } from 'react';

import {
  Avatar,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/components/ui';
import { fetchLeaderboards, selectLeaderboardsState } from '@/store/slices/leaderboardsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { cn } from '@/utils/cn';

function getRankClassName(index: number) {
  if (index === 1) {
    return 'bg-primary text-primary-foreground';
  }

  if (index === 2) {
    return 'bg-secondary text-secondary-foreground';
  }

  if (index === 3) {
    return 'bg-muted text-foreground';
  }

  return 'bg-background text-muted-foreground';
}

function LeaderboardRow({
  index,
  name,
  score,
  avatar,
}: {
  avatar: string;
  index: number;
  name: string;
  score: number;
}) {
  const rankClassName = getRankClassName(index);

  return (
    <li className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/40">
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold',
          rankClassName,
        )}
      >
        {index}
      </span>
      <Avatar alt={`${name} avatar`} name={name} src={avatar} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">Skor kontribusi</p>
      </div>
      <Badge className="shrink-0 font-mono text-xs" variant="secondary">
        {score}
      </Badge>
    </li>
  );
}

export function LeaderboardsPage() {
  const dispatch = useAppDispatch();
  const { error, items, status } = useAppSelector(selectLeaderboardsState);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchLeaderboards());
    }
  }, [dispatch, status]);

  const isLoading = status === 'loading';
  const isEmpty = status === 'succeeded' && items.length === 0;

  return (
    <section className="container-responsive grid gap-6 py-10 md:py-14">
      <Card as="section" className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-4xl md:text-5xl">Kontributor Terbaik</CardTitle>
          <CardDescription className="max-w-2xl text-base leading-7 md:text-lg">
            Lihat daftar pengguna dengan skor tertinggi dari komunitas forum.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card as="section">
        <CardContent className="grid gap-4 pt-6">
          {isLoading ? <LoadingState label="Memuat papan peringkat…" /> : null}
          {status === 'failed' ? (
            <ErrorState
              message={error ?? 'Papan peringkat gagal dimuat.'}
              onRetry={() => {
                void dispatch(fetchLeaderboards());
              }}
            />
          ) : null}
          {isEmpty ? <EmptyState message="Belum ada data leaderboard untuk ditampilkan." /> : null}
          {status === 'succeeded' && items.length > 0 ? (
            <ol className="grid gap-3">
              {items.map((item, index) => (
                <LeaderboardRow
                  avatar={item.user.avatar}
                  index={index + 1}
                  key={item.user.id}
                  name={item.user.name}
                  score={item.score}
                />
              ))}
            </ol>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
