import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  Card,
  buttonVariants,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ErrorState,
  LoadingState,
} from '@/components/ui';
import { CommentForm, CommentList } from '@/features/comments';
import {
  clearThreadDetail,
  fetchThreadDetail,
  selectThreadDetail,
  selectThreadDetailState,
  submitComment,
  ThreadContent,
  ThreadDetailHeader,
} from '@/features/threads';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

export function ThreadDetailPage() {
  const { threadId = '' } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { authedUser } = useAppSelector((state) => state.auth);
  const { commentError, commentStatus, error, notFound, status } =
    useAppSelector(selectThreadDetailState);
  const thread = useAppSelector(selectThreadDetail);
  const isLoading = status === 'loading';
  const isCommentLoading = commentStatus === 'loading';

  useEffect(() => {
    if (!threadId) {
      return;
    }

    void dispatch(fetchThreadDetail(threadId));

    return () => {
      dispatch(clearThreadDetail());
    };
  }, [dispatch, threadId]);

  if (isLoading) {
    return (
      <section className="container-responsive py-10 md:py-14">
        <LoadingState label="Memuat detail thread…" />
      </section>
    );
  }

  if (notFound) {
    return (
      <section className="container-responsive py-10 md:py-14">
        <ErrorState
          actionLabel="Kembali ke beranda"
          message="Thread tidak ditemukan atau sudah dihapus."
          onRetry={() => {
            void navigate('/');
          }}
          title="Thread tidak ditemukan"
        />
      </section>
    );
  }

  if (status === 'failed') {
    return (
      <section className="container-responsive py-10 md:py-14">
        <ErrorState
          message={error ?? 'Thread gagal dimuat.'}
          onRetry={() => {
            void dispatch(fetchThreadDetail(threadId));
          }}
        />
      </section>
    );
  }

  if (!thread) {
    return null;
  }

  return (
    <section className="container-responsive grid gap-6 py-10 md:py-14">
      <ThreadDetailHeader thread={thread} />
      <ThreadContent authedUserId={authedUser?.id} thread={thread} />

      <Card as="section">
        <CardHeader>
          <CardTitle>Komentar ({thread.comments.length})</CardTitle>
          <CardDescription>Diskusi dari komunitas.</CardDescription>
        </CardHeader>
        <CardContent>
          <CommentList
            authedUserId={authedUser?.id}
            comments={thread.comments}
            threadId={thread.id}
          />
        </CardContent>
      </Card>

      <Card as="section">
        <CardHeader>
          <CardTitle>Tambah komentar</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {authedUser ? (
            <>
              <CommentForm
                isLoading={isCommentLoading}
                onSubmit={async (content) => {
                  try {
                    const result = await dispatch(
                      submitComment({ content, threadId: thread.id }),
                    ).unwrap();
                    showSuccessToast(result, 'Komentar berhasil dikirim.');
                  } catch (requestError) {
                    showErrorToast(requestError, 'Komentar gagal dikirim.');
                    throw requestError;
                  }
                }}
              />
              {commentError ? <p className="text-sm text-destructive">{commentError}</p> : null}
            </>
          ) : (
            <div className="grid gap-3 rounded-lg border border-dashed bg-muted/30 p-6">
              <p className="text-muted-foreground">Masuk dulu untuk menulis komentar.</p>
              <Link
                className={buttonVariants({
                  className: 'w-fit',
                  variant: 'outline',
                })}
                to="/login"
              >
                Masuk ke akun
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
