import { describe, expect, it } from 'vitest';

import { getPostHogConfig, getPostHogOrigins } from '~/lib/posthog';

const env = { PUBLIC_POSTHOG_KEY: 'phc_test', PUBLIC_POSTHOG_HOST: 'https://us.i.posthog.com' };

describe('getPostHogConfig', () => {
  it('returns the key and host in a deployed build', () => {
    expect(getPostHogConfig(env, false)).toEqual({
      key: 'phc_test',
      host: 'https://us.i.posthog.com',
    });
  });

  it('stays off when the key or host is missing (e.g. an environment with no project)', () => {
    expect(getPostHogConfig({ PUBLIC_POSTHOG_HOST: env.PUBLIC_POSTHOG_HOST }, false)).toBeNull();
    expect(getPostHogConfig({ PUBLIC_POSTHOG_KEY: env.PUBLIC_POSTHOG_KEY }, false)).toBeNull();
  });

  it('stays off in dev unless PUBLIC_POSTHOG_DEV=true', () => {
    expect(getPostHogConfig(env, true)).toBeNull();
    expect(getPostHogConfig({ ...env, PUBLIC_POSTHOG_DEV: 'false' }, true)).toBeNull();
    expect(getPostHogConfig({ ...env, PUBLIC_POSTHOG_DEV: 'true' }, true)).not.toBeNull();
  });
});

describe('getPostHogOrigins', () => {
  it('pairs the ingestion host with its assets host', () => {
    expect(getPostHogOrigins('https://us.i.posthog.com')).toEqual([
      'https://us.i.posthog.com',
      'https://us-assets.i.posthog.com',
    ]);
  });

  it('allows nothing when the host is unset or malformed', () => {
    expect(getPostHogOrigins(undefined)).toEqual([]);
    expect(getPostHogOrigins('not a url')).toEqual([]);
  });
});
