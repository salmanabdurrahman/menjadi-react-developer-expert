import { Link } from 'react-router-dom';

import { Button, buttonVariants } from '@/components/ui';
import type { VoteType } from '@/types/api';

interface VoteButtonProps {
  activeType?: VoteType;
  isLoading?: boolean;
  onVote?: (voteType: VoteType) => void | Promise<void>;
  score: number;
}

function getVoteLabel(voteType: VoteType) {
  if (voteType === 1) {
    return 'suka';
  }

  if (voteType === -1) {
    return 'tidak suka';
  }

  return 'netral';
}

export function VoteButton({ activeType = 0, isLoading = false, onVote, score }: VoteButtonProps) {
  if (!onVote) {
    return (
      <Link className={buttonVariants({ variant: 'outline' })} to="/login">
        Masuk untuk memberi vote
      </Link>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-md border bg-background p-1">
      <Button
        aria-label={`Vote suka, status saat ini ${getVoteLabel(activeType)}`}
        disabled={isLoading}
        onClick={() => {
          void onVote(1);
        }}
        size="sm"
        type="button"
        variant={activeType === 1 ? 'default' : 'ghost'}
      >
        {isLoading ? '…' : '▲'}
      </Button>
      <span className="min-w-8 text-center text-sm font-semibold">{score}</span>
      <Button
        aria-label={`Vote tidak suka, status saat ini ${getVoteLabel(activeType)}`}
        disabled={isLoading}
        onClick={() => {
          void onVote(-1);
        }}
        size="sm"
        type="button"
        variant={activeType === -1 ? 'default' : 'ghost'}
      >
        {isLoading ? '…' : '▼'}
      </Button>
    </div>
  );
}
