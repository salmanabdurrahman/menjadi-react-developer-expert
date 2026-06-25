import { useState } from 'react';
import type { FormEvent } from 'react';

import { Button, Textarea } from '@/components/ui';

interface CommentFormProps {
  isLoading?: boolean;
  onSubmit: (content: string) => Promise<void> | void;
}

export function CommentForm({ isLoading = false, onSubmit }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim()) {
      setError('Komentar wajib diisi.');
      return;
    }

    setError('');
    void Promise.resolve(onSubmit(content.trim()))
      .then(() => {
        setContent('');
      })
      .catch(() => undefined);
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
      <Textarea
        error={error}
        label="Tulis komentar"
        name="content"
        onChange={(event) => setContent(event.target.value)}
        placeholder="Bagikan pendapatmu…"
        value={content}
      />
      <Button className="w-fit" isLoading={isLoading} type="submit">
        Kirim komentar
      </Button>
    </form>
  );
}
