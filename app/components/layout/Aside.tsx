import { createContext, type ReactNode, useContext, useState } from 'react';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet';

type AsideType = 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A right-side slide-in drawer. Built on the shadcn/ui `Sheet` (Radix Dialog),
 * so focus trap, scroll lock, return-focus, Esc-to-close, and ARIA come for
 * free. Open state is shared via {@link useAside}.
 */
export const Aside = ({
  children,
  heading,
  type,
}: {
  children?: ReactNode;
  type: AsideType;
  heading: ReactNode;
}) => {
  const { type: activeType, close } = useAside();
  const open = type === activeType;

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) close();
      }}
    >
      <SheetContent
        side="right"
        className="w-[350px] gap-0 p-0 sm:w-[450px] sm:max-w-none"
        aria-describedby={undefined}
      >
        <SheetHeader className="border-border-subtle h-16 justify-center border-b px-5">
          <SheetTitle className="text-sm font-semibold tracking-[0.18em] uppercase">
            {heading}
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </SheetContent>
    </Sheet>
  );
};

const AsideContext = createContext<AsideContextValue | null>(null);

const AsideProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

Aside.Provider = AsideProvider;

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
