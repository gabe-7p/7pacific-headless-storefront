import { PostHog } from 'posthog-node';

type PostHogEnv = Env & {
  VITE_PUBLIC_POSTHOG_PROJECT_TOKEN?: string;
  VITE_PUBLIC_POSTHOG_HOST?: string;
};

export const createPostHogClient = (env: Env) => {
  const { VITE_PUBLIC_POSTHOG_PROJECT_TOKEN: token, VITE_PUBLIC_POSTHOG_HOST: host } =
    env as PostHogEnv;

  if (import.meta.env.DEV && !token) {
    throw new Error(
      'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
    );
  }
  if (import.meta.env.DEV && !host) {
    throw new Error(
      'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured'
    );
  }

  if (!token || !host) return undefined;

  return new PostHog(token, {
    host,
    flushAt: 1,
    flushInterval: 0,
    enableExceptionAutocapture: true,
  });
};
