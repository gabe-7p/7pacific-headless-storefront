// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { CareIcon } from '~/components/product/CareIcon';

afterEach(cleanup);

describe('CareIcon', () => {
  it.each([
    'Machine Wash Cold',
    'Wash with like colors',
    'Do not bleach',
    'Lay flat to dry',
    'Do not iron',
  ])('renders an icon for "%s" (all seeded care labels)', (label) => {
    const { container } = render(<CareIcon label={label} />);
    // Stroke follows a palette token (currentColor), not a hardcoded hex
    // (7PA-229); Concrete, not Ember — the accent is rationed (7PA-230).
    expect(container.querySelector('svg path')?.getAttribute('stroke')).toBe('currentColor');
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('text-concrete');
  });

  it('matches labels case- and whitespace-insensitively', () => {
    const { container } = render(<CareIcon label="  MACHINE WASH COLD " />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('renders nothing for unknown labels (text-only degradation)', () => {
    const { container } = render(<CareIcon label="Dry clean only" />);
    expect(container.innerHTML).toBe('');
  });
});
