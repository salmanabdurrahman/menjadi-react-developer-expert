import { Loader2 } from 'lucide-react';

import { Card } from '@/components/ui/Card';

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = 'Memuat data…' }: LoadingStateProps) {
  return (
    <Card
      as="section"
      aria-live="polite"
      className="grid justify-items-center gap-4 p-8 text-center"
      role="status"
    >
      <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <div className="grid w-full max-w-xs gap-2" aria-hidden="true">
        <div className="mx-auto h-3 w-3/4 animate-pulse rounded-full bg-muted" />
        <div className="mx-auto h-3 w-1/2 animate-pulse rounded-full bg-muted" />
      </div>
    </Card>
  );
}
