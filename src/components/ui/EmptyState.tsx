import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

import { Card } from '@/components/ui/Card';

interface EmptyStateProps {
  action?: ReactNode;
  message?: string;
  title?: string;
}

export function EmptyState({
  action,
  message = 'Belum ada data untuk ditampilkan.',
  title = 'Masih kosong',
}: EmptyStateProps) {
  return (
    <Card as="section" className="grid justify-items-center gap-4 border-dashed p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Inbox className="size-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="grid gap-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      </div>
      {action ? <div className="pt-2">{action}</div> : null}
    </Card>
  );
}
