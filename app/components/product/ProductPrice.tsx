import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';

import { Price } from '~/components/common/Price';

export const ProductPrice = ({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) => {
  // font-medium, not bold — mono runs Regular/Medium only in the type system.
  return (
    <div className="product-price font-medium">
      {compareAtPrice ? (
        <div className="product-price-on-sale">
          {price ? <Price data={price} /> : null}
          <s className="text-support">
            <Price data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <Price data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
};
