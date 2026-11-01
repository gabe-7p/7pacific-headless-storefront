import { useEffect, useRef } from 'react';

import { CartMain } from '~/components/cart/CartMain';
import { NewsletterDialogProvider } from '~/components/common/NewsletterDialog';
import { Announcement } from '~/components/layout/Announcement';
import { Aside, useAside } from '~/components/layout/Aside';
import { Footer } from '~/components/layout/Footer';
import { Header, HeaderMenu } from '~/components/layout/Header';
import { useCart } from '~/lib/cart';
import { registerCartDrawerOpener } from '~/lib/cartDrawer';
import type { FooterData, HeaderData } from '~/lib/fragments';
import { publishCartViewed } from '~/lib/shopifyAnalytics';

type PageLayoutProps = {
  footer: Promise<FooterData | null>;
  header: HeaderData;
  publicStoreDomain: string;
  children?: React.ReactNode;
};

export const PageLayout = ({
  children = null,
  footer,
  header,
  publicStoreDomain,
}: PageLayoutProps) => {
  return (
    <Aside.Provider>
      <NewsletterDialogProvider>
        <CartAside />
        <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
        {/* Sticky topbar offset by the announcement height: the announcement
            scrolls away with the page while the header pins — mirrors live. */}
        <div className="sticky -top-(--announcement-h) z-40">
          <Announcement />
          <Header header={header} publicStoreDomain={publicStoreDomain} />
        </div>
        <main>{children}</main>
        {/* The footer signup is always present; the membership CTAs open the
            same form in a dialog (click-triggered only, never on load). */}
        <Footer footer={footer} header={header} publicStoreDomain={publicStoreDomain} />
      </NewsletterDialogProvider>
    </Aside.Provider>
  );
};

/**
 * The cart drawer. Opens from the header bag, from the PDP's add-to-cart
 * (`afterSubmit`) and from Shopify's `openCart` standard action (permalinks,
 * agents) via the lib/cartDrawer registry; publishes `cart_viewed` each time
 * it opens.
 */
const CartAside = () => {
  const { type, open } = useAside();
  const cart = useCart((state) => state.data);
  const cartRef = useRef(cart);
  cartRef.current = cart;

  useEffect(() => {
    registerCartDrawerOpener(() => open('cart'));
  }, [open]);

  useEffect(() => {
    if (type === 'cart') publishCartViewed(cartRef.current);
  }, [type]);

  return (
    <Aside type="cart" heading="Cart">
      <CartMain layout="aside" />
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
