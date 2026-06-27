import { Form, useActionData, useNavigation } from 'react-router';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { Button } from '~/components/ui/button';
import { CONTACT } from '~/content/contact';
import { pageTitle } from '~/lib/seo';

import type { Route } from './+types/pages.contact-us';

export const meta: Route.MetaFunction = () => {
  return [{ title: pageTitle('Contact Us') }];
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type ContactErrors = Partial<Record<'name' | 'email' | 'message', string>>;

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const message = String(form.get('message') ?? '').trim();

  const errors: ContactErrors = {};
  if (!name) errors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';
  if (!message) errors.message = 'Please enter a message.';
  if (Object.keys(errors).length > 0) return { ok: false as const, errors };

  // TODO: deliver the message (Shopify contact endpoint / email provider).
  // Storefront API has no contact mutation; wire this to the chosen provider.
  return { ok: true as const };
}

const fieldClass =
  'w-full border border-border-subtle bg-white px-4 py-3 text-sm focus:border-black focus:outline-none';

const Contact = () => {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submitting = navigation.state !== 'idle';
  const errors = actionData && !actionData.ok ? actionData.errors : undefined;

  return (
    <Container className="max-w-2xl py-16 md:py-24">
      <div className="text-center">
        <Heading as="h1" size="lg">
          {CONTACT.heading}
        </Heading>
        <p className="mx-auto mt-3 max-w-md text-sm text-neutral-600">{CONTACT.intro}</p>
      </div>

      {actionData?.ok ? (
        <p className="mt-10 text-center text-sm font-medium">{CONTACT.successMessage}</p>
      ) : (
        <Form method="post" className="mt-10 space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="sr-only">
              {CONTACT.fields.name.label}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder={CONTACT.fields.name.placeholder}
              className={fieldClass}
            />
            {errors?.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              {CONTACT.fields.email.label}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder={CONTACT.fields.email.placeholder}
              className={fieldClass}
            />
            {errors?.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="sr-only">
              {CONTACT.fields.phone.label}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder={CONTACT.fields.phone.placeholder}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="message" className="sr-only">
              {CONTACT.fields.message.label}
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              placeholder={CONTACT.fields.message.placeholder}
              className={fieldClass}
            />
            {errors?.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
          </div>
          <Button type="submit" variant="brand" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? 'Sending…' : CONTACT.submitLabel}
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default Contact;
