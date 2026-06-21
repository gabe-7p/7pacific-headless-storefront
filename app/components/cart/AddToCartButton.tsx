import { CartForm, type OptimisticCartLineInput } from '@shopify/hydrogen';
import { type FetcherWithComponents } from 'react-router';

export const AddToCartButton = ({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) => {
  return (
    <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<unknown>) => (
        <>
          <input name="analytics" type="hidden" value={JSON.stringify(analytics)} />
          <button type="submit" onClick={onClick} disabled={disabled ?? fetcher.state !== 'idle'}>
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
};
