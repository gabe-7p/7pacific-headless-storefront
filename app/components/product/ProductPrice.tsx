import { Price } from '~/components/common/Price';
import type { MoneyLike } from '~/lib/money';

export const ProductPrice = ({
  price,
  compareAtPrice,
}: {
  price?: MoneyLike | null;
  compareAtPrice?: MoneyLike | null;
}) => {
  // font-medium, not bold — mono runs Regular/Medium only in the type system.
  return (
    <div className="font-medium">
      {compareAtPrice ? (
        <div className="flex gap-2 [&_s]:opacity-50">
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
