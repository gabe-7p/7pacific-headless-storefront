// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Price } from '~/components/common/Price';

const money = (amount: string) => ({ amount, currencyCode: 'USD' as const });

afterEach(cleanup);

describe('Price', () => {
  it('renders nothing without data', () => {
    const { container } = render(<Price data={null} compareAt={money('60.0')} />);
    expect(container.textContent).toBe('');
  });

  it('renders a lone price without a strike-through', () => {
    const { container } = render(<Price data={money('48.0')} compareAt={null} />);
    expect(container.querySelector('s')).toBeNull();
  });

  it('strikes the compare-at price beside the price', () => {
    const { container } = render(<Price data={money('48.0')} compareAt={money('60.0')} />);
    const struck = container.querySelector('s');
    expect(struck?.textContent).toContain('60');
    expect(container.textContent?.indexOf('48')).toBeLessThan(
      container.textContent?.indexOf('60') ?? -1
    );
  });

  it('puts className on both prices when a compare-at price is set', () => {
    const { container } = render(
      <Price data={money('48.0')} compareAt={money('60.0')} className="font-medium" />
    );
    const spans = [...container.querySelectorAll('span.font-mono')];
    expect(spans).toHaveLength(2);
    expect(spans.every((span) => span.classList.contains('font-medium'))).toBe(true);
    expect(container.querySelector('s span')?.classList).toContain('font-medium');
  });
});
