import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar';
import type { ImgHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

export type AvatarProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  name: string;
  src?: string | null;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

export function Avatar({ alt, className, name, src, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        'relative flex size-10 shrink-0 overflow-hidden rounded-full border bg-muted',
        className,
      )}
    >
      {src ? (
        <AvatarPrimitive.Image
          data-slot="avatar-image"
          className="aspect-square size-full object-cover"
          src={src}
          alt={alt ?? name}
          {...props}
        />
      ) : null}
      <AvatarPrimitive.Fallback
        data-slot="avatar-fallback"
        className="flex size-full items-center justify-center text-sm font-medium text-muted-foreground"
      >
        {getInitials(name) || '?'}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
