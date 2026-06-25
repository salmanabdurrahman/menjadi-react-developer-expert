import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '@/components/ui';
import { login } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, status } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';
  const isLoading = status === 'loading';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextFieldErrors = {
      email: email.trim() ? '' : 'Email wajib diisi.',
      password: password ? '' : 'Password wajib diisi.',
    };
    setFieldErrors(nextFieldErrors);

    if (nextFieldErrors.email || nextFieldErrors.password) {
      return;
    }

    void dispatch(login({ email, password }))
      .unwrap()
      .then(
        (payload) => {
          showSuccessToast(payload, 'Berhasil masuk.');
          void navigate(redirectTo, { replace: true });
        },
        (requestError) => {
          showErrorToast(requestError, 'Masuk gagal.');
        },
      );
  }

  return (
    <section className="container-responsive grid min-h-[calc(100vh-8rem)] max-w-xl place-items-center py-12">
      <Card as="section" className="w-full">
        <CardHeader className="text-center md:text-left">
          <CardTitle className="text-3xl">Masuk ke akun</CardTitle>
          <CardDescription>Masuk untuk membuat thread dan ikut berdiskusi.</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
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
              autoComplete="current-password"
              error={fieldErrors.password}
              label="Password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button className="w-full" isLoading={isLoading} type="submit">
              Masuk
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link
              className="font-medium text-primary underline-offset-4 hover:underline"
              to="/register"
            >
              Daftar sekarang
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
