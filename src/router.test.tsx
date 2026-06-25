import { describe, expect, it } from 'vitest';

import { router } from '@/router';

describe('router', () => {
  it('registers main app routes', () => {
    const rootRoute = router.routes[0];
    const childPaths = rootRoute.children?.map((route) => route.path ?? 'index') ?? [];

    expect(childPaths).toEqual(
      expect.arrayContaining([
        'index',
        'threads/:threadId',
        'login',
        'register',
        'leaderboards',
        '*',
      ]),
    );
    expect(rootRoute.children?.some((route) => route.children?.[0]?.path === 'threads/new')).toBe(
      true,
    );
  });
});
