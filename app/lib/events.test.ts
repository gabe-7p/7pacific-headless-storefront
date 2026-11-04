// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { isPlainActivation } from '~/lib/events';

const anchor = (attributes: Record<string, string> = {}) => {
  const element = document.createElement('a');
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
};

const click = (overrides: Partial<Parameters<typeof isPlainActivation>[0]> = {}) => ({
  defaultPrevented: false,
  button: 0,
  metaKey: false,
  altKey: false,
  ctrlKey: false,
  shiftKey: false,
  currentTarget: anchor(),
  ...overrides,
});

describe('isPlainActivation', () => {
  it('accepts a plain primary click on a same-tab link', () => {
    expect(isPlainActivation(click())).toBe(true);
    expect(isPlainActivation(click({ currentTarget: anchor({ target: '_self' }) }))).toBe(true);
  });

  it.each(['metaKey', 'altKey', 'ctrlKey', 'shiftKey'] as const)('leaves a %s click', (key) => {
    expect(isPlainActivation(click({ [key]: true }))).toBe(false);
  });

  it('leaves middle clicks and clicks another handler already prevented', () => {
    expect(isPlainActivation(click({ button: 1 }))).toBe(false);
    expect(isPlainActivation(click({ defaultPrevented: true }))).toBe(false);
  });

  it('leaves links that open elsewhere or download', () => {
    expect(isPlainActivation(click({ currentTarget: anchor({ target: '_blank' }) }))).toBe(false);
    expect(isPlainActivation(click({ currentTarget: anchor({ download: '' }) }))).toBe(false);
  });

  it('reads the anchor passed by a delegated handler, not the container', () => {
    const container = document.createElement('div');
    expect(isPlainActivation(click({ currentTarget: container }))).toBe(true);
    expect(
      isPlainActivation(click({ currentTarget: container }), anchor({ target: '_blank' }))
    ).toBe(false);
  });
});
