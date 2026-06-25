import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/cn';
import { badgeVariants } from '@/components/ui/badgeVariants';

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
