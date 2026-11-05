import { Cache, gql } from '@shopify/hydrogen';
import { Form, useActionData, useLoaderData, useNavigation } from 'react-router';

import { Container } from '~/components/common/Container';
import { Cta } from '~/components/common/Cta';
import { FieldError } from '~/components/common/FieldError';
import { Heading } from '~/components/common/Heading';
import { Prose } from '~/components/common/Prose';
import { CONTACT } from '~/content/contact';
import { HANDLES } from '~/content/links';
import {
  handleFormAction,
  readField,
  REQUIRED_MESSAGE_MESSAGE,
  REQUIRED_NAME_MESSAGE,
  validateEmail,
  validateRequired,
} from '~/lib/forms';
import { buildMeta } from '~/lib/seo';
import { queryStorefront, storefrontClientContext } from '~/lib/storefront';

import type { Route } from './+types/pages.contact-us';

export const meta: Route.MetaFunction = () => {
  return buildMeta({ title: 'Contact Us' });
};

export async function loader({ context }: Route.LoaderArgs) {
  // The live Contact page's static copy (intro, support email, returns block)
  // lives in the Shopify page body; render it above the form.
  const data = await queryStorefront(context.get(storefrontClientContext), CONTACT_PAGE_QUERY, {
    variables: { handle: HANDLES.contactPage },
    cache: Cache.long(),
  });
  return { page: data?.page ?? null };
}

/** Same `{ ok, errors }` contract and status codes as routes/api.subscribe. */
export const action = ({ request }: Route.ActionArgs) =>
  handleFormAction<'name' | 'email' | 'message'>(request, {
    methodField: 'message',
    check: (form) => ({
      name: validateRequired(readField(form, 'name'), REQUIRED_NAME_MESSAGE),
      email: validateEmail(readField(form, 'email')),
      message: validateRequired(readField(form, 'message'), REQUIRED_MESSAGE_MESSAGE),
    }),
    // TODO: deliver the message (Shopify contact endpoint / email provider).
    // Storefront API has no contact mutation; wire this to the chosen provider.
  });

const fieldClass =
  'w-full rounded-none border border-border-subtle bg-field px-4 py-3 text-sm focus:border-ink focus:outline-none';

const Contact = () => {
  const { page } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submitting = navigation.state !== 'idle';
  const errors = actionData && !actionData.ok ? actionData.errors : undefined;

  return (
    <Container className="py-16 md:py-24">
      {/* Live centres a ~960px column and lets the copy sit on the page — no card. */}
      <div className="mx-auto max-w-(--page-narrow)">
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
          <Form method="post" className="mt-10 space-y-4 md:max-w-sm" noValidate>
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
              {errors?.name && <FieldError>{errors.name}</FieldError>}
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
              {errors?.email && <FieldError>{errors.email}</FieldError>}
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
              {errors?.message && <FieldError>{errors.message}</FieldError>}
            </div>
            {/* Secondary — the contact page carries no Ember moment. */}
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
