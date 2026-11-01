import { describe, expect, it } from 'vitest';

import {
  getPostHogConfig,
  getPostHogOrigins,
  getRouteErrorException,
  isOxygenPreviewHost,
} from '~/lib/analytics/posthog';

const env = { PUBLIC_POSTHOG_KEY: 'phc_test', PUBLIC_POSTHOG_HOST: 'https://us.i.posthog.com' };
const production = { isDev: false, hostname: '7pacificapparel.com' };
const dev = { isDev: true, hostname: 'localhost' };
const preview = {
  isDev: false,
  hostname: '01m6b3gqktxasa942n6tkvchmt-44d79d5021aa19ed15aa.myshopify.dev',
};

describe('getPostHogConfig', () => {
  it('returns the key and host on the production domain', () => {
    expect(getPostHogConfig(env, production)).toEqual({
      key: 'phc_test',
      host: 'https://us.i.posthog.com',
    });
  });

  it('stays off when the key or host is missing (e.g. an environment with no project)', () => {
    expect(
      getPostHogConfig({ PUBLIC_POSTHOG_HOST: env.PUBLIC_POSTHOG_HOST }, production)
    ).toBeNull();
    expect(getPostHogConfig({ PUBLIC_POSTHOG_KEY: env.PUBLIC_POSTHOG_KEY }, production)).toBeNull();
  });

  it('stays off in dev unless PUBLIC_POSTHOG_DEV=true', () => {
    expect(getPostHogConfig(env, dev)).toBeNull();
    expect(getPostHogConfig({ ...env, PUBLIC_POSTHOG_DEV: 'false' }, dev)).toBeNull();
    expect(getPostHogConfig({ ...env, PUBLIC_POSTHOG_DEV: 'true' }, dev)).not.toBeNull();
  });

  it('stays off on an Oxygen preview host unless PUBLIC_POSTHOG_DEV=true (our own testing is not a session)', () => {
    expect(getPostHogConfig(env, preview)).toBeNull();
    expect(getPostHogConfig({ ...env, PUBLIC_POSTHOG_DEV: 'true' }, preview)).not.toBeNull();
  });
});

describe('isOxygenPreviewHost', () => {
  it('matches every *.myshopify.dev host and nothing else', () => {
    expect(isOxygenPreviewHost(preview.hostname)).toBe(true);
    expect(isOxygenPreviewHost('7pacificapparel.com')).toBe(false);
    expect(isOxygenPreviewHost('www.7pacificapparel.com')).toBe(false);
    expect(isOxygenPreviewHost('7pacific-7311.myshopify.com')).toBe(false);
    expect(isOxygenPreviewHost('localhost')).toBe(false);
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

describe('getRouteErrorException', () => {
  it('turns a route error response into an Error that names its status', () => {
    const exception = getRouteErrorException({
      status: 500,
      statusText: 'Internal Server Error',
      data: 'boom',
    });
    expect(exception).toBeInstanceOf(Error);
    expect(exception.name).toBe('RouteErrorResponse');
    expect(exception.message).toBe('500 Internal Server Error');
  });

  it('falls back to the bare status when there is no status text', () => {
    expect(getRouteErrorException({ status: 503, statusText: '', data: null }).message).toBe('503');
  });
});
