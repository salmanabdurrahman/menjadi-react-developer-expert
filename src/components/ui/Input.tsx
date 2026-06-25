import { Input as InputPrimitive } from '@base-ui/react/input';
import * as React from 'react';

import { cn } from '@/utils/cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, id, label, type = 'text', ...props }, ref) => {
    const inputId = id ?? props.name;
    const errorId = error && inputId ? `${inputId}-error` : undefined;

    return (
      <label className="grid gap-2 text-sm font-medium" htmlFor={inputId}>
        <span>{label}</span>
        <InputPrimitive
          ref={ref}
          id={inputId}
          type={type}
          aria-describedby={errorId}
          aria-invalid={Boolean(error)}
          data-slot="input"
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/30',
            className,
          )}
          {...props}
        />
        {error ? (
          <span className="text-sm font-normal text-destructive" id={errorId}>
            {error}
          </span>
        ) : null}
      </label>
    );
  },
);
Input.displayName = 'Input';
