import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ErrorStateProps {
  actionLabel?: string;
  message?: string;
  onRetry?: () => void;
  title?: string;
}

export function ErrorState({
  actionLabel = 'Coba lagi',
  message = 'Terjadi kesalahan. Silakan ulangi beberapa saat lagi.',
  onRetry,
  title = 'Data gagal dimuat',
}: ErrorStateProps) {
  return (
    <Card
      as="section"
      className="grid justify-items-center gap-4 border-destructive/30 p-8 text-center"
      role="alert"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="size-5 text-destructive" aria-hidden="true" />
      </div>
      <div className="grid gap-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry ? (
        <Button onClick={onRetry} type="button" variant="secondary">
          {actionLabel}
        </Button>
      ) : null}
    </Card>
  );
}
