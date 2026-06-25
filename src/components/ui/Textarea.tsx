import * as React from 'react';

import { cn } from '@/utils/cn';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
  label: string;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, id, label, ...props }, ref) => {
    const textareaId = id ?? props.name;
    const errorId = error && textareaId ? `${textareaId}-error` : undefined;

    return (
      <label className="grid gap-2 text-sm font-medium" htmlFor={textareaId}>
        <span>{label}</span>
        <textarea
          ref={ref}
          id={textareaId}
          aria-describedby={errorId}
          aria-invalid={Boolean(error)}
          data-slot="textarea"
          className={cn(
            'flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/30',
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
Textarea.displayName = 'Textarea';
