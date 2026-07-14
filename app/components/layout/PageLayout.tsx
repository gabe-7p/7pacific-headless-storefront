import { Suspense } from 'react';
import { Await } from 'react-router';
import type { CartApiQueryFragment, FooterQuery, HeaderQuery } from 'storefrontapi.generated';

import { CartMain } from '~/components/cart/CartMain';
import { Announcement } from '~/components/layout/Announcement';
import { Aside } from '~/components/layout/Aside';
import { Footer } from '~/components/layout/Footer';
import { Header, HeaderMenu } from '~/components/layout/Header';

type PageLayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
  children?: React.ReactNode;
};

export const PageLayout = ({
  cart,
  children = null,
  footer,
  header,
  publicStoreDomain,
}: PageLayoutProps) => {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      {/* Sticky topbar offset by the announcement height: the announcement
          scrolls away with the page while the header pins — mirrors live. */}
      <div className="sticky -top-(--announcement-h) z-40">
        <Announcement />
        {header && <Header header={header} cart={cart} publicStoreDomain={publicStoreDomain} />}
      </div>
      <main>{children}</main>
      {/* The footer signup is the one newsletter per page — the site-wide
          popup is gone (7PA-241: no interruption modals, no discount bribe). */}
      <Footer footer={footer} header={header} publicStoreDomain={publicStoreDomain} />
    </Aside.Provider>
  );
};

const CartAside = ({ cart }: { cart: PageLayoutProps['cart'] }) => {
  return (
    <Aside type="cart" heading="Cart">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
};

const MobileMenuAside = ({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) => {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="Menu" side="left" showHeader={false}>
        <HeaderMenu
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </Aside>
    )
  );
};
