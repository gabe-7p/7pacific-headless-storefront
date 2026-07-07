import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';

import { Price } from '~/components/common/Price';

export const ProductPrice = ({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) => {
  return (
    <div className="product-price font-bold">
      {compareAtPrice ? (
        <div className="product-price-on-sale">
          {price ? <Price data={price} /> : null}
          <s className="text-neutral-400">
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
