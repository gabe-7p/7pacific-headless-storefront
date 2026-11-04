import { describe, expect, it } from 'vitest';

import { describeRouteError, notFound, unavailable } from '~/lib/http';

// What React Router hands the boundary for a thrown Response / data().
const routeError = (status: number, body: unknown) => ({
  status,
  statusText: '',
  data: body,
  internal: true,
});

describe('notFound / unavailable', () => {
  it('build 404 and 500 responses', async () => {
    expect(notFound().status).toBe(404);
    expect(await notFound('Gone').text()).toBe('Gone');
    expect(unavailable().status).toBe(500);
    expect(await unavailable('Down').text()).toBe('Down');
  });
});

describe('describeRouteError', () => {
  it('describes a thrown 404 response', () => {
    expect(describeRouteError(routeError(404, 'Not found'))).toEqual({
      status: 404,
      message: 'Not found',
      isNotFound: true,
    });
  });

  it('reads the message of a data() object body', () => {
    expect(describeRouteError(routeError(500, { message: 'bad' })).message).toBe('bad');
  });

  it('string-coerces an object body without a message (never an object)', () => {
    const described = describeRouteError(routeError(500, { code: 'x' }));
    expect(described.message).toBe('{"code":"x"}');
    expect(typeof described.message).toBe('string');
  });

  it('describes an Error as a 500', () => {
    expect(describeRouteError(new Error('kaput'))).toEqual({
      status: 500,
      message: 'kaput',
      isNotFound: false,
    });
  });

  it('describes a string and unknown values', () => {
    expect(describeRouteError('oops').message).toBe('oops');
    expect(describeRouteError(undefined)).toEqual({
      status: 500,
      message: 'Unknown error',
      isNotFound: false,
    });
  });
});
