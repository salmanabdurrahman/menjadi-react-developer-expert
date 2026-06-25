import { Link, NavLink } from 'react-router-dom';

import { Button, buttonVariants } from '@/components/ui';
import { cn } from '@/utils/cn';

interface HeaderProps {
  isAuthenticated: boolean;
  userName?: string;
  onLogout: () => void;
}

const navItems = [
  { label: 'Beranda', to: '/' },
  { label: 'Buat Thread', to: '/threads/new' },
  { label: 'Papan Peringkat', to: '/leaderboards' },
];

export function Header({ isAuthenticated, onLogout, userName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-responsive flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-3 md:justify-start">
          <Link
            className="text-lg font-semibold tracking-tight transition-colors hover:text-primary"
            to="/"
          >
            Forum Diskusi
          </Link>
          {isAuthenticated ? (
            <span className="max-w-40 truncate rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground md:hidden">
              {userName ?? 'Pengguna forum'}
            </span>
          ) : null}
        </div>

        <nav aria-label="Navigasi utama" className="flex flex-wrap gap-1">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden max-w-56 truncate text-sm text-muted-foreground md:block md:max-w-96">
                {userName ?? 'Pengguna forum'}
              </span>
              <Button onClick={onLogout} type="button" variant="secondary">
                Keluar
              </Button>
            </>
          ) : (
            <>
              <Link className={buttonVariants({ variant: 'ghost' })} to="/login">
                Masuk
              </Link>
              <Link className={buttonVariants()} to="/register">
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
