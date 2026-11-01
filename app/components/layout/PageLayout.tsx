import { CartDrawer } from '~/components/cart/CartDrawer';
import { JoinDialogProvider } from '~/components/common/JoinDialog';
import { Announcement } from '~/components/layout/Announcement';
import { Aside } from '~/components/layout/Aside';
import { Footer } from '~/components/layout/Footer';
import { Header, HeaderMenu } from '~/components/layout/Header';
import type { FooterData, HeaderData } from '~/lib/fragments';

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
      <JoinDialogProvider>
        <CartDrawer />
        <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
        {/* Sticky topbar offset by the announcement height: the announcement
            scrolls away with the page while the header pins — mirrors live. */}
        <div className="sticky -top-(--announcement-h) z-40">
          <Announcement />
          <Header header={header} publicStoreDomain={publicStoreDomain} />
        </div>
        <main>{children}</main>
        {/* The footer signup is always present; the membership CTAs (and the
            Coming Soon card) open the same form in a dialog — click-triggered
            only, never on load. */}
        <Footer footer={footer} header={header} publicStoreDomain={publicStoreDomain} />
      </JoinDialogProvider>
    </Aside.Provider>
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
