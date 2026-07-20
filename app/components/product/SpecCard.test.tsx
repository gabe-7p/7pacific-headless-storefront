// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { SpecCard } from '~/components/product/SpecCard';

afterEach(cleanup);

const FULL = {
  fabric: '92% polyester · 8% elastane shell',
  weight: '182 g, size M',
  use: 'Tempo · race day · daily training',
  seams: 'Bonded',
  pockets: '1 zip (rear) · 1 stash (front)',
  fit: 'Close, not compressive',
  origin: 'Designed in San Francisco',
};

describe('SpecCard', () => {
  it('renders the seven fields in the locked order', () => {
    const { container } = render(<SpecCard data={FULL} />);
    const labels = Array.from(container.querySelectorAll('dt')).map((dt) => dt.textContent);
    expect(labels).toEqual(['Fabric', 'Weight', 'Use', 'Seams', 'Pockets', 'Fit', 'Origin']);
  });

  it('omits rows without a value instead of inventing them (no measured weight → no WEIGHT row)', () => {
    const { weight: _weight, ...withoutWeight } = FULL;
    const { container } = render(<SpecCard data={withoutWeight} />);
    const labels = Array.from(container.querySelectorAll('dt')).map((dt) => dt.textContent);
    expect(labels).not.toContain('Weight');
    expect(labels).toHaveLength(6);
  });

  it('renders nothing for an empty spec object', () => {
    const { container } = render(<SpecCard data={{}} />);
    expect(container.innerHTML).toBe('');
  });
});
