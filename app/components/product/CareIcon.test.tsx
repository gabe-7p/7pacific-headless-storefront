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
    expect(container.querySelector('svg path')?.getAttribute('stroke')).toBe('#F26927');
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
