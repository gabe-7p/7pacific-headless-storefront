// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import type * as ReactRouter from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { JoinForm } from '~/components/common/JoinForm';
import { JOIN_COPY } from '~/content/join';
import { INVALID_EMAIL_MESSAGE, REQUIRED_NAME_MESSAGE, type SubscribeResponse } from '~/lib/forms';

type FetcherStub = { state: 'idle' | 'submitting'; data: SubscribeResponse | undefined };

let fetcher: FetcherStub = { state: 'idle', data: undefined };

// The fetcher is the form's only router dependency: stub it so each state
// can be rendered directly, without a router or a network.
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof ReactRouter>();
  const Form = ({ children, ...props }: ComponentProps<'form'>) => (
    <form {...props}>{children}</form>
  );
  return { ...actual, useFetcher: () => ({ ...fetcher, Form }) };
});

const renderForm = (props: Partial<ComponentProps<typeof JoinForm>> = {}) =>
  render(<JoinForm list="newsletter" copy={JOIN_COPY.newsletter} {...props} />);

const hidden = (name: string) =>
  document.querySelector<HTMLInputElement>(`input[type="hidden"][name="${name}"]`);

afterEach(() => {
  cleanup();
  fetcher = { state: 'idle', data: undefined };
});

describe('JoinForm — newsletter', () => {
  it('posts the name, email and list to /api/subscribe', () => {
    renderForm();
    const form = document.querySelector('form');
    expect(form).toHaveProperty('method', 'post');
    expect(form?.getAttribute('action')).toBe('/api/subscribe');
    expect(hidden('list')?.value).toBe('newsletter');
    expect(screen.getByLabelText(JOIN_COPY.newsletter.emailPlaceholder)).toHaveProperty(
      'name',
      'email'
    );
    const name = screen.getByLabelText(JOIN_COPY.newsletter.namePlaceholder);
    expect(name).toHaveProperty('name', 'name');
    expect(name).toHaveProperty('required', true);
    // Browser validation stays on unless the surface opts out.
    expect(form?.noValidate).toBe(false);
  });

  it('renders the mail-glyph submit treatment', () => {
    renderForm({ submit: 'mail' });
    const button = screen.getByRole('button', { name: JOIN_COPY.newsletter.submitLabel });
    expect(button.getAttribute('type')).toBe('submit');
    expect(button.querySelector('svg')).not.toBeNull();
    expect(screen.getByLabelText(JOIN_COPY.newsletter.emailPlaceholder).className).toContain(
      'pr-10'
    );
  });

  it('renders the email error under the field', () => {
    fetcher = { state: 'idle', data: { ok: false, errors: { email: INVALID_EMAIL_MESSAGE } } };
    renderForm();
    expect(screen.getByText(INVALID_EMAIL_MESSAGE)).not.toBeNull();
  });

  it('disables the submit while submitting', () => {
    fetcher = { state: 'submitting', data: undefined };
    renderForm({ submit: 'mail' });
    expect(screen.getByRole('button', { name: JOIN_COPY.newsletter.submitLabel })).toHaveProperty(
      'disabled',
      true
    );
  });

  it('replaces the form with the confirmation on success', () => {
    fetcher = { state: 'idle', data: { ok: true } };
    renderForm();
    expect(screen.getByText(JOIN_COPY.newsletter.successMessage)).not.toBeNull();
    expect(document.querySelector('form')).toBeNull();
  });
});

describe('JoinForm — waitlist', () => {
  const waitlist = { list: 'waitlist', copy: JOIN_COPY.waitlist } as const;

  it('renders the name field, sends the waitlist list and skips browser validation', () => {
    renderForm({ ...waitlist, noValidate: true });
    expect(hidden('list')?.value).toBe('waitlist');
    expect(screen.getByLabelText(JOIN_COPY.waitlist.namePlaceholder)).toHaveProperty(
      'name',
      'name'
    );
    expect(screen.getByLabelText(JOIN_COPY.waitlist.emailPlaceholder)).toHaveProperty(
      'name',
      'email'
    );
    expect(document.querySelector('form')?.noValidate).toBe(true);
    expect(screen.getByRole('button', { name: JOIN_COPY.waitlist.submitLabel })).toHaveProperty(
      'type',
      'submit'
    );
  });

  it('renders each field error beside its field', () => {
    fetcher = {
      state: 'idle',
      data: {
        ok: false,
        errors: { name: REQUIRED_NAME_MESSAGE, email: INVALID_EMAIL_MESSAGE },
      },
    };
    renderForm(waitlist);
    expect(screen.getByText(REQUIRED_NAME_MESSAGE)).not.toBeNull();
    expect(screen.getByText(INVALID_EMAIL_MESSAGE)).not.toBeNull();
  });

  it('replaces the form with the waitlist confirmation on success', () => {
    fetcher = { state: 'idle', data: { ok: true } };
    renderForm(waitlist);
    expect(screen.getByText(JOIN_COPY.waitlist.successMessage)).not.toBeNull();
    expect(document.querySelector('form')).toBeNull();
  });
});

describe('JoinForm — errors', () => {
  const invalid: SubscribeResponse = { ok: false, errors: { email: INVALID_EMAIL_MESSAGE } };

  it('renders a field error in the tone of the ground', () => {
    fetcher = { state: 'idle', data: invalid };
    renderForm({ tone: 'day' });
    expect(screen.getByRole('alert').classList).toContain('text-error');
  });

  it('defaults to the night tone', () => {
    fetcher = { state: 'idle', data: invalid };
    renderForm();
    expect(screen.getByRole('alert').classList).toContain('text-error-night');
  });

  it('sets the error a step larger on the mail row', () => {
    fetcher = { state: 'idle', data: invalid };
    renderForm({ submit: 'mail' });
    expect(screen.getByRole('alert').classList).toContain('text-sm');
  });
});
