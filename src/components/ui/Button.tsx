import { Button as ButtonPrimitive } from '@base-ui/react/button';
import type { VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/utils/cn';
import { buttonVariants } from '@/components/ui/buttonVariants';

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];

export type ButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof ButtonPrimitive>,
  'className'
> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    isLoading?: boolean;
  };

export function Button({
  className,
  variant = 'default',
  size = 'default',
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled ? true : isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 aria-hidden="true" className="animate-spin" />
          Memuat…
        </>
      ) : (
        children
      )}
    </ButtonPrimitive>
  );
}
