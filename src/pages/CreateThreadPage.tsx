import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from '@/components/ui';
import { fetchThreads, selectCategory, submitThread } from '@/store/slices/threadsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

export function CreateThreadPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status: authStatus } = useAppSelector((state) => state.auth);
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ body: '', title: '' });

  const isLoading = isSubmitting || authStatus === 'loading';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextFieldErrors = {
      body: body.trim() ? '' : 'Isi thread wajib diisi.',
      title: title.trim() ? '' : 'Judul thread wajib diisi.',
    };
    setFieldErrors(nextFieldErrors);
    setError('');

    if (nextFieldErrors.title || nextFieldErrors.body) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await dispatch(
        submitThread({
          body: body.trim(),
          category: category.trim() || 'Umum',
          title: title.trim(),
        }),
      ).unwrap();
      await dispatch(fetchThreads()).unwrap();
      dispatch(selectCategory('all'));
      showSuccessToast(result, 'Thread berhasil dibuat.');
      void navigate('/', { replace: true });
    } catch (requestError) {
      let message = 'Thread gagal dibuat.';

      if (typeof requestError === 'string') {
        message = requestError;
      } else if (requestError instanceof Error) {
        ({ message } = requestError);
      }

      setError(message);
      showErrorToast(message, 'Thread gagal dibuat.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="container-responsive max-w-3xl py-10 md:py-14">
      <Card as="section">
        <CardHeader>
          <CardTitle className="text-3xl">Buat thread baru</CardTitle>
          <CardDescription>
            Isi formulir di bawah untuk memulai diskusi baru bersama komunitas.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
            noValidate
          >
            <Input
              error={fieldErrors.title}
              label="Judul"
              name="title"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
            <Input
              label="Kategori"
              name="category"
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Umum"
              value={category}
            />
            <Textarea
              error={fieldErrors.body}
              label="Isi thread"
              name="body"
              onChange={(event) => setBody(event.target.value)}
              value={body}
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button className="w-full sm:w-fit" isLoading={isLoading} type="submit">
              Buat thread
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
