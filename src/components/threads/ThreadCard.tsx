import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Avatar,
  Badge,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import type { VoteType } from '@/types/api';
import { formatRelativeDate } from '@/utils/date';
import { truncateHtml } from '@/utils/text';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { computeVoteState, getVoteScore, getVoteStatus } from '@/utils/vote';
import { VoteButton } from '@/components/votes';
import { downVoteThread, neutralVoteThread, upVoteThread } from '@/services/forum/votesApi';
import type { ThreadWithOwner } from '@/store/slices/threadsSlice';

interface ThreadCardProps {
  authedUserId?: string;
  thread: ThreadWithOwner;
}

export function ThreadCard({ authedUserId, thread }: ThreadCardProps) {
  const [upVotesBy, setUpVotesBy] = useState(thread.upVotesBy);
  const [downVotesBy, setDownVotesBy] = useState(thread.downVotesBy);
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState('');
  const summary = truncateHtml(thread.body, 180);
  const voteCount = getVoteScore(upVotesBy, downVotesBy);
  const voteStatus = getVoteStatus(upVotesBy, downVotesBy, authedUserId);

  async function handleVote(voteType: VoteType) {
    if (!authedUserId) {
      return;
    }

    setIsVoting(true);
    setVoteError('');
    try {
      let result: { message: string } | undefined;

      if (voteType === 1) {
        const nextAction = voteStatus === 1 ? neutralVoteThread : upVoteThread;
        result = await nextAction(thread.id);
      }

      if (voteType === -1) {
        const nextAction = voteStatus === -1 ? neutralVoteThread : downVoteThread;
        result = await nextAction(thread.id);
      }

      const nextState = computeVoteState(upVotesBy, downVotesBy, authedUserId, voteType);
      setUpVotesBy(nextState.upVotesBy);
      setDownVotesBy(nextState.downVotesBy);
      showSuccessToast(result, 'Vote thread berhasil diproses.');
    } catch (requestError) {
      setVoteError('Vote thread gagal diproses.');
      showErrorToast(requestError, 'Vote thread gagal diproses.');
    } finally {
      setIsVoting(false);
    }
  }

  return (
    <Card as="article">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <Badge variant="secondary">{thread.category}</Badge>
          <span className="shrink-0 text-sm text-muted-foreground">
            {formatRelativeDate(thread.createdAt)}
          </span>
        </div>
        <CardTitle className="text-2xl">
          <Link className="transition-colors hover:text-primary" to={`/threads/${thread.id}`}>
            {thread.title}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="leading-7 text-muted-foreground">{summary}</p>
      </CardContent>

      <CardFooter className="flex-wrap justify-between gap-4 border-t pt-6 text-sm text-muted-foreground">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar
            alt={thread.owner?.name ?? 'Pengguna forum'}
            name={thread.owner?.name ?? 'Pengguna'}
            src={thread.owner?.avatar}
          />
          <span className="truncate">{thread.owner?.name ?? 'Pengguna tidak dikenal'}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="shrink-0">{thread.totalComments} komentar</span>
          <div className="grid gap-2">
            <VoteButton
              activeType={voteStatus}
              isLoading={isVoting}
              onVote={authedUserId ? handleVote : undefined}
              score={voteCount}
            />
            {voteError ? <p className="text-sm text-destructive">{voteError}</p> : null}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
