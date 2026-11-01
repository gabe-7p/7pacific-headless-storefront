import { Cache, gql } from '@shopify/hydrogen';
import { data, Form, useActionData, useLoaderData, useNavigation } from 'react-router';

import { Container } from '~/components/common/Container';
import { Cta } from '~/components/common/Cta';
import { Heading } from '~/components/common/Heading';
import { Prose } from '~/components/common/Prose';
import { CONTACT } from '~/content/contact';
import {
  collectErrors,
  type FormResult,
  readField,
  REQUIRED_MESSAGE_MESSAGE,
  REQUIRED_NAME_MESSAGE,
  validateEmail,
  validateRequired,
} from '~/lib/forms';
import { buildMeta } from '~/lib/seo';
import { storefrontClientContext } from '~/lib/storefront';

import type { Route } from './+types/pages.contact-us';

export const meta: Route.MetaFunction = () => {
  return buildMeta({ title: 'Contact Us' });
};

export async function loader({ context }: Route.LoaderArgs) {
  // The live Contact page's static copy (intro, support email, returns block)
  // lives in the Shopify page body; render it above the form.
  const { data } = await context.get(storefrontClientContext).graphql(CONTACT_PAGE_QUERY, {
    variables: { handle: 'contact-us' },
    cache: Cache.long(),
  });
  return { page: data?.page ?? null };
}

type ContactResponse = FormResult<'name' | 'email' | 'message'>;

/** Same `{ ok, errors }` contract and status codes as routes/api.subscribe. */
export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return data<ContactResponse>(
      { ok: false, errors: { message: 'Method not allowed' } },
      { status: 405 }
    );
  }

  const form = await request.formData();
  const errors = collectErrors({
    name: validateRequired(readField(form, 'name'), REQUIRED_NAME_MESSAGE),
    email: validateEmail(readField(form, 'email')),
    message: validateRequired(readField(form, 'message'), REQUIRED_MESSAGE_MESSAGE),
  });
  if (errors) return data<ContactResponse>({ ok: false, errors }, { status: 400 });

  // TODO: deliver the message (Shopify contact endpoint / email provider).
  // Storefront API has no contact mutation; wire this to the chosen provider.
  return data<ContactResponse>({ ok: true });
}

const fieldClass =
  'w-full border border-border-subtle bg-field px-4 py-3 text-sm focus:border-ink focus:outline-none';

const Contact = () => {
  const { page } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submitting = navigation.state !== 'idle';
  const errors = actionData && !actionData.ok ? actionData.errors : undefined;

  return (
    <Container className="py-16 md:py-24">
      {/* Live centres a ~960px column and lets the copy sit on the page — no card. */}
      <div className="mx-auto max-w-[960px]">
        <Heading as="h1" variant="quiet" size="none" className="text-[2.4rem] font-semibold">
          Contact Us
        </Heading>

        {page?.body && <Prose html={page.body} variant="compact" className="mt-6" />}

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
            {/* Secondary — the contact page carries no Ember moment (7PA-230). */}
            <Cta type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? 'Sending…' : CONTACT.submitLabel}
            </Cta>
          </Form>
        )}
      </div>
    </Container>
  );
};

const CONTACT_PAGE_QUERY = gql(`
  query ContactPage($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    page(handle: $handle) {
      id
      title
      body
    }
  }
`);

export default Contact;
