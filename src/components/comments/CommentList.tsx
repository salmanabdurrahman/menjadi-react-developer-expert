import { EmptyState } from '@/components/ui';
import type { Comment } from '@/types/api';
import { CommentCard } from '@/components/comments/CommentCard';

interface CommentListProps {
  authedUserId?: string;
  comments: Comment[];
  threadId: string;
}

export function CommentList({ authedUserId, comments, threadId }: CommentListProps) {
  if (comments.length === 0) {
    return <EmptyState message="Belum ada komentar. Jadilah yang pertama." />;
  }

  return (
    <div className="grid gap-4">
      {comments.map((comment) => (
        <CommentCard
          authedUserId={authedUserId}
          comment={comment}
          key={comment.id}
          threadId={threadId}
        />
      ))}
    </div>
  );
}
