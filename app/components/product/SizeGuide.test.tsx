// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { SizeGuide } from '~/components/product/SizeGuide';

afterEach(cleanup);

const openDrawer = () => {
  render(<SizeGuide />);
  fireEvent.click(screen.getByRole('button', { name: 'Size Guide' }));
};

describe('SizeGuide', () => {
  it('renders only the trigger until it is clicked', () => {
    render(<SizeGuide />);
    expect(screen.getByRole('button', { name: 'Size Guide' })).toBeTruthy();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens on the imperial table', () => {
    openDrawer();
    expect(screen.getByRole('dialog')).toBeTruthy();
    // S hip — picked because several cells repeat across rows (34 - 36 is both
    // S chest and L waist), so a duplicated value proves nothing about units.
    expect(screen.getByText('33.5 - 35.5')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'In' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('swaps the rows when the unit toggle flips to metric', () => {
    openDrawer();
    fireEvent.click(screen.getByRole('button', { name: 'Cm' }));
    expect(screen.getByText('108 - 113')).toBeTruthy();
    expect(screen.queryByText('33.5 - 35.5')).toBeNull();
  });

  it('closes on the CLOSE link', () => {
    openDrawer();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
