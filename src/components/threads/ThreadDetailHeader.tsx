import { Badge, Card, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import type { ThreadDetail } from '@/types/api';
import { formatRelativeDate } from '@/utils/date';

interface ThreadDetailHeaderProps {
  thread: ThreadDetail;
}

export function ThreadDetailHeader({ thread }: ThreadDetailHeaderProps) {
  return (
    <Card as="article">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <Badge variant="secondary">{thread.category}</Badge>
          <span className="text-sm text-muted-foreground">
            {formatRelativeDate(thread.createdAt)}
          </span>
        </div>
        <div className="grid gap-2">
          <CardTitle className="text-3xl md:text-4xl">{thread.title}</CardTitle>
          <CardDescription>Oleh {thread.owner.name}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
