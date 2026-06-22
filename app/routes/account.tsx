import { data as remixData, Form, NavLink, Outlet, useLoaderData } from 'react-router';

import { Container } from '~/components/common/Container';
import { Heading } from '~/components/common/Heading';
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery';
import { cn } from '~/lib/cn';

import type { Route } from './+types/account';

export function shouldRevalidate() {
  return true;
}

export async function loader({ context }: Route.LoaderArgs) {
  const { customerAccount } = context;
  const { data, errors } = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    { customer: data.customer },
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );
}

const AccountLayout = () => {
  const { customer } = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <Container className="py-10 md:py-14">
      <Heading as="h1" size="lg" className="mb-6">
        {heading}
      </Heading>
      <AccountMenu />
      <div className="mt-10">
        <Outlet context={{ customer }} />
      </div>
    </Container>
  );
};

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'text-xs font-medium tracking-[0.12em] uppercase transition-opacity hover:opacity-70',
    isActive ? 'underline underline-offset-4' : 'text-neutral-500'
  );

const AccountMenu = () => {
  return (
    <nav
      role="navigation"
      className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-neutral-200 pb-4"
    >
      <NavLink to="/account/orders" className={navLinkClass}>
        Orders
      </NavLink>
      <NavLink to="/account/profile" className={navLinkClass}>
        Profile
      </NavLink>
      <NavLink to="/account/addresses" className={navLinkClass}>
        Addresses
      </NavLink>
      <Logout />
    </nav>
  );
};

const Logout = () => {
  return (
    <Form method="POST" action="/account/logout" className="ml-auto">
      <button
        type="submit"
        className="text-xs font-medium tracking-[0.12em] text-neutral-500 uppercase transition-opacity hover:opacity-70"
      >
        Sign out
      </button>
    </Form>
  );
};

export default AccountLayout;
