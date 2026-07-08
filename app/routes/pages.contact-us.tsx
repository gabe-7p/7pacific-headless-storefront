import type { MouseEvent } from 'react';
import { Form, useActionData, useLoaderData, useNavigate, useNavigation } from 'react-router';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { Button } from '~/components/ui/button';
import { CONTACT } from '~/content/contact';
import { pageTitle } from '~/lib/seo';

import type { Route } from './+types/pages.contact-us';

export const meta: Route.MetaFunction = () => {
  return [{ title: pageTitle('Contact Us') }];
};

export async function loader({ context }: Route.LoaderArgs) {
  // The live Contact page's static copy (intro, support email, returns block)
  // lives in the Shopify page body; render it above the form.
  const { page } = await context.storefront.query(CONTACT_PAGE_QUERY, {
    variables: { handle: 'contact-us' },
    cache: context.storefront.CacheLong(),
  });
  return { page };
}

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
  const { page } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const submitting = navigation.state !== 'idle';
  const errors = actionData && !actionData.ok ? actionData.errors : undefined;

  // Route internal links inside the static content (e.g. the Returns & Exchanges
  // block's link to /pages/returns) through the client router instead of a full
  // page reload.
  const handleContentClick = (event: MouseEvent<HTMLDivElement>) => {
    const link = (event.target as HTMLElement).closest('a');
    const href = link?.getAttribute('href');
    if (href?.startsWith('/')) {
      event.preventDefault();
      void navigate(href);
    }
  };

  return (
    <Container className="py-16 md:py-24">
      {/* Left-aligned content column (matches live) — not a centered narrow box. */}
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Contact Us</h1>

        {page?.body && (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
          <div
            onClick={handleContentClick}
            className="border-border-subtle mt-6 border bg-neutral-50 p-6 md:p-8 [&_a]:text-brand [&_a]:underline [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:tracking-wide [&_h2]:uppercase [&_h2:first-of-type]:mt-6 [&_p]:mt-3 [&_p]:text-sm [&_p]:leading-7 [&_p]:text-neutral-600 [&_strong]:font-semibold [&_strong]:text-neutral-900"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        )}

        <Heading as="h2" size="md" className="mt-12">
          Send Us a Message
        </Heading>

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
            <Button
              type="submit"
              variant="brand"
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              {submitting ? 'Sending…' : CONTACT.submitLabel}
            </Button>
          </Form>
        )}
      </div>
    </Container>
  );
};

const CONTACT_PAGE_QUERY = `#graphql
  query ContactPage($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    page(handle: $handle) {
      id
      title
      body
    }
  }
` as const;

export default Contact;
