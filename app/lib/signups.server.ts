import type { JoinList } from '~/content/join';
import { adminGraphql } from '~/lib/adminApi.server';

/**
 * Where signups land: each one becomes (or updates) a Shopify customer,
 * subscribed to email marketing and tagged with its list. Find them in
 * Shopify admin → Customers, filtered by the tag; Shopify Email can send to
 * that segment. Changing a tag here doesn't retag customers already saved.
 */
const SIGNUP_TAGS: Record<JoinList, string> = {
  newsletter: 'newsletter',
  waitlist: 'first-light-waitlist',
};

/** Added only when the signup creates the customer: the old Liquid theme's
    mark for someone who hasn't bought (its newsletter form tagged
    `prospect,newsletter`), so the list continues where the theme left off. */
const NEW_CUSTOMER_TAG = 'prospect';

/** Signed up through the site form, so single opt-in (no confirmation email). */
const SUBSCRIBED = { marketingState: 'SUBSCRIBED', marketingOptInLevel: 'SINGLE_OPT_IN' };

const CUSTOMER_BY_EMAIL_QUERY = `
  query SignupCustomer($email: String!) {
    customerByIdentifier(identifier: { emailAddress: $email }) { id }
  }
`;

const CUSTOMER_CREATE_MUTATION = `
  mutation SignupCustomerCreate($input: CustomerInput!) {
    customerCreate(input: $input) { customer { id } userErrors { field message } }
  }
`;

const CUSTOMER_UPDATE_MUTATION = `
  mutation SignupCustomerUpdate(
    $id: ID!
    $tags: [String!]!
    $consent: CustomerEmailMarketingConsentUpdateInput!
  ) {
    tagsAdd(id: $id, tags: $tags) { userErrors { field message } }
    customerEmailMarketingConsentUpdate(input: $consent) { userErrors { field message } }
  }
`;

type UserErrors = Array<{ field: Array<string> | null; message: string }>;

export type SignupResult = { ok: true } | { ok: false; reason: 'invalid-email' | 'failed' };

/** "Mason Reyes" → first "Mason", last "Reyes"; a single word is the first name. */
const splitName = (name: string) => {
  const [firstName, ...rest] = name.split(/\s+/);
  return { firstName, lastName: rest.join(' ') || undefined };
};

const failed = (errors: UserErrors): SignupResult => {
  console.error('Signup rejected by Shopify:', errors);
  const isEmail = errors.some(({ field }) => field?.includes('email'));
  return { ok: false, reason: isEmail ? 'invalid-email' : 'failed' };
};

/**
 * Save a signup to Shopify. A new email creates the customer (name included
 * when the list collects one, tagged `prospect` too); a known email keeps its
 * name and gains the list's tag and a subscribed marketing state. Never throws: an Admin API
 * failure is logged and reported as `failed`.
 */
export const saveSignup = async (
  env: Env,
  { list, email, name }: { list: JoinList; email: string; name?: string }
): Promise<SignupResult> => {
  const tags = [SIGNUP_TAGS[list]];
  try {
    const { customerByIdentifier: existing } = await adminGraphql<{
      customerByIdentifier: { id: string } | null;
    }>(env, CUSTOMER_BY_EMAIL_QUERY, { email });

    if (existing) {
      const result = await adminGraphql<{
        tagsAdd: { userErrors: UserErrors };
        customerEmailMarketingConsentUpdate: { userErrors: UserErrors };
      }>(env, CUSTOMER_UPDATE_MUTATION, {
        id: existing.id,
        tags,
        consent: { customerId: existing.id, emailMarketingConsent: SUBSCRIBED },
      });
      const errors = [
        ...result.tagsAdd.userErrors,
        ...result.customerEmailMarketingConsentUpdate.userErrors,
      ];
      return errors.length > 0 ? failed(errors) : { ok: true };
    }

    const { customerCreate } = await adminGraphql<{
      customerCreate: { userErrors: UserErrors };
    }>(env, CUSTOMER_CREATE_MUTATION, {
      input: {
        email,
        ...(name ? splitName(name) : {}),
        tags: [...tags, NEW_CUSTOMER_TAG],
        emailMarketingConsent: SUBSCRIBED,
      },
    });
    return customerCreate.userErrors.length > 0 ? failed(customerCreate.userErrors) : { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, reason: 'failed' };
  }
};
