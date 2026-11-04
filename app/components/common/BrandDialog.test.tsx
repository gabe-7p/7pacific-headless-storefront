// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { BrandDialogTitle } from '~/components/common/BrandDialog';
import { Dialog, DialogContent } from '~/components/ui/dialog';

afterEach(cleanup);

describe('BrandDialogTitle', () => {
  it("restates the brand leading over DialogTitle's leading-none", () => {
    render(
      <Dialog open>
        <DialogContent aria-describedby={undefined}>
          <BrandDialogTitle>Join the roster</BrandDialogTitle>
        </DialogContent>
      </Dialog>
    );

    const { classList } = screen.getByRole('heading', { name: 'Join the roster' });
    expect(classList).toContain('leading-[1.1]');
    expect(classList).not.toContain('leading-none');
  });
});
