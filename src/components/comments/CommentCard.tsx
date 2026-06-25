import { useState } from 'react';

import { Avatar, Card, CardContent, CardHeader } from '@/components/ui';
import type { Comment, VoteType } from '@/types/api';
import { formatRelativeDate } from '@/utils/date';
import { sanitizeHtml } from '@/utils/html';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { computeVoteState, getVoteScore, getVoteStatus } from '@/utils/vote';
import { VoteButton } from '@/components/votes';
import { downVoteComment, neutralVoteComment, upVoteComment } from '@/services/forum/votesApi';

interface CommentCardProps {
  authedUserId?: string;
  comment: Comment;
  threadId: string;
}

export function CommentCard({ authedUserId, comment, threadId }: CommentCardProps) {
  const [upVotesBy, setUpVotesBy] = useState(comment.upVotesBy);
  const [downVotesBy, setDownVotesBy] = useState(comment.downVotesBy);
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState('');
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
        const nextAction = voteStatus === 1 ? neutralVoteComment : upVoteComment;
        result = await nextAction(threadId, comment.id);
      }

      if (voteType === -1) {
        const nextAction = voteStatus === -1 ? neutralVoteComment : downVoteComment;
        result = await nextAction(threadId, comment.id);
      }

      const nextState = computeVoteState(upVotesBy, downVotesBy, authedUserId, voteType);
      setUpVotesBy(nextState.upVotesBy);
      setDownVotesBy(nextState.downVotesBy);
      showSuccessToast(result, 'Vote komentar berhasil diproses.');
    } catch (requestError) {
      setVoteError('Vote komentar gagal diproses.');
      showErrorToast(requestError, 'Vote komentar gagal diproses.');
    } finally {
      setIsVoting(false);
    }
  }

  return (
    <Card as="article">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar alt={comment.owner.name} name={comment.owner.name} src={comment.owner.avatar} />
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{comment.owner.name}</h3>
            <p className="text-sm text-muted-foreground">{formatRelativeDate(comment.createdAt)}</p>
          </div>
        </div>
        <div className="grid justify-items-end gap-2">
          <VoteButton
            activeType={voteStatus}
            isLoading={isVoting}
            onVote={authedUserId ? handleVote : undefined}
            score={voteCount}
          />
          {voteError ? <p className="text-sm text-destructive">{voteError}</p> : null}
        </div>
      </CardHeader>

      <CardContent>
        <div
          className="prose-body text-base leading-7"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(comment.content) }}
        />
      </CardContent>
    </Card>
  );
}
