import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '@/components/ui';
import { register } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, status } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    name: '',
    password: '',
  });
  const isLoading = status === 'loading';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let passwordError = '';

    if (password.length === 0) {
      passwordError = 'Password wajib diisi.';
    } else if (password.length < 6) {
      passwordError = 'Password minimal 6 karakter.';
    }

    const nextFieldErrors = {
      email: email.trim() ? '' : 'Email wajib diisi.',
      name: name.trim() ? '' : 'Nama wajib diisi.',
      password: passwordError,
    };
    setFieldErrors(nextFieldErrors);

    if (nextFieldErrors.email || nextFieldErrors.name || nextFieldErrors.password) {
      return;
    }

    void dispatch(register({ email, name, password }))
      .unwrap()
      .then(
        (payload) => {
          showSuccessToast(payload, 'Pendaftaran berhasil. Silakan masuk.');
          void navigate('/login', { replace: true });
        },
        (requestError) => {
          showErrorToast(requestError, 'Pendaftaran gagal.');
        },
      );
  }

  return (
    <section className="container-responsive grid min-h-[calc(100vh-8rem)] max-w-xl place-items-center py-12">
      <Card as="section" className="w-full">
        <CardHeader className="text-center md:text-left">
          <CardTitle className="text-3xl">Buat akun baru</CardTitle>
          <CardDescription>Daftar untuk membuat thread dan ikut berdiskusi.</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
            <Input
              autoComplete="name"
              error={fieldErrors.name}
              label="Nama"
              name="name"
              onChange={(event) => setName(event.target.value)}
              value={name}
            />
            <Input
              autoComplete="email"
              error={fieldErrors.email}
              label="Email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              value={email}
            />
            <Input
              autoComplete="new-password"
              error={fieldErrors.password}
              label="Password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button className="w-full" isLoading={isLoading} type="submit">
              Daftar
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link
              className="font-medium text-primary underline-offset-4 hover:underline"
              to="/login"
            >
              Masuk
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
