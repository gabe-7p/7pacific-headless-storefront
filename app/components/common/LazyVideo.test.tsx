// @vitest-environment jsdom
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LazyVideo } from '~/components/common/LazyVideo';

const SRC = 'https://cdn.shopify.com/videos/c/vp/id/id.HD-720p.mp4';

type Callback = (entries: Array<{ isIntersecting: boolean }>) => void;

/** The observers in creation order: the loader, then the player. */
let observers: Array<Callback> = [];

const fire = (index: number, isIntersecting: boolean) =>
  act(() => observers[index]?.([{ isIntersecting }]));

beforeEach(() => {
  observers = [];
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: Callback) {
        observers.push(callback);
      }
      observe = () => undefined;
      disconnect = () => undefined;
    }
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('LazyVideo', () => {
  it('attaches no src until the clip nears the viewport', () => {
    const { container } = render(<LazyVideo src={SRC} />);
    const video = container.querySelector('video');

    expect(video?.getAttribute('src')).toBeNull();
    fire(0, false);
    expect(video?.getAttribute('src')).toBeNull();
    fire(0, true);
    expect(video?.getAttribute('src')).toBe(SRC);
  });

  // Setting `src` aborts a pending play(), so a clip that starts in view stays
  // paused for good if the player's callback lands first and src comes after.
  it('has its src before it plays when the player observer fires first', () => {
    const srcAtPlay: Array<string | null> = [];
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (
      this: HTMLMediaElement
    ) {
      srcAtPlay.push(this.getAttribute('src'));
      return Promise.resolve();
    });
    render(<LazyVideo src={SRC} />);

    fire(1, true);
    fire(0, true);

    expect(srcAtPlay).toEqual([SRC]);
  });

  it('does not reassign src when the loader fires after the player', () => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    const { container } = render(<LazyVideo src={SRC} />);
    const video = container.querySelector('video');
    if (!video) throw new Error('no <video> rendered');
    fire(1, true);
    const assign = vi.spyOn(video, 'src', 'set');

    fire(0, true);

    expect(assign).not.toHaveBeenCalled();
  });

  it('pauses off screen', () => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockReturnValue(undefined);
    render(<LazyVideo src={SRC} />);

    fire(1, false);

    expect(pause).toHaveBeenCalledOnce();
  });
});
