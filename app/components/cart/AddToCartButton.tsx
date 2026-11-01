import { CartForm, type OptimisticCartLineInput } from '@shopify/hydrogen';
import { type FetcherWithComponents } from 'react-router';

export const AddToCartButton = ({
  children,
  className,
  disabled,
  lines,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) => {
  return (
    <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<unknown>) => (
        <button
          type="submit"
          className={className}
          onClick={onClick}
          disabled={disabled ?? fetcher.state !== 'idle'}
        >
          {children}
        </button>
      )}
    </CartForm>
  );
};
