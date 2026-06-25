import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { ThreadDetail, VoteType } from '@/types/api';
import { sanitizeHtml } from '@/utils/html';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { computeVoteState, getVoteScore, getVoteStatus } from '@/utils/vote';
import { VoteButton, downVoteThread, neutralVoteThread, upVoteThread } from '@/features/votes';

interface ThreadContentProps {
  authedUserId?: string;
  thread: ThreadDetail;
}

export function ThreadContent({ authedUserId, thread }: ThreadContentProps) {
  const [upVotesBy, setUpVotesBy] = useState(thread.upVotesBy);
  const [downVotesBy, setDownVotesBy] = useState(thread.downVotesBy);
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
    <Card as="section">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <CardTitle>Isi Thread</CardTitle>
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
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(thread.body) }}
        />
      </CardContent>
    </Card>
  );
}
