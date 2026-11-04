// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { FieldError } from '~/components/common/FieldError';

afterEach(cleanup);

describe('FieldError', () => {
  it('announces as an alert in the day error token', () => {
    render(<FieldError>Enter a valid discount code</FieldError>);

    const { classList, textContent } = screen.getByRole('alert');
    expect(textContent).toBe('Enter a valid discount code');
    expect(classList).toContain('text-error');
  });

  it('takes the night token on a dark ground', () => {
    render(<FieldError tone="night">Bad email</FieldError>);

    expect(screen.getByRole('alert').classList).toContain('text-error-night');
  });
});
