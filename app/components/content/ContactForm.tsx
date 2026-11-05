import { Form } from 'react-router';

import { Cta } from '~/components/common/Cta';
import { FieldError } from '~/components/common/FieldError';
import { CONTACT } from '~/content/contact';
import type { FormResult } from '~/lib/forms';

const fieldClass =
  'w-full rounded-none border border-border-subtle bg-field px-4 py-3 text-sm focus:border-ink focus:outline-none';

type ContactFormProps = {
  /** The route action's last result; absent before the first submit. */
  result: FormResult<'name' | 'email' | 'message'> | undefined;
  submitting: boolean;
};

export const ContactForm = ({ result, submitting }: ContactFormProps) => {
  const errors = result && !result.ok ? result.errors : undefined;

  if (result?.ok) {
    return <p className="mt-10 text-center text-sm font-medium">{CONTACT.successMessage}</p>;
  }

  return (
    <Form method="post" className="mt-10 space-y-4 md:max-w-100" noValidate>
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
  );
};
