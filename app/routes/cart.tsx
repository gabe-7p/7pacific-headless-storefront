import type { CartQueryDataReturn } from '@shopify/hydrogen';
import { CartForm } from '@shopify/hydrogen';
import { data, type HeadersFunction, useLoaderData } from 'react-router';

import { CartMain } from '~/components/cart/CartMain';
import { Heading } from '~/components/common/Heading';
import { TextLink } from '~/components/common/TextLink';
import { pageTitle } from '~/lib/seo';

import type { Route } from './+types/cart';

export const meta: Route.MetaFunction = () => {
  return [{ title: pageTitle('Cart') }];
};

export const headers: HeadersFunction = ({ actionHeaders }) => actionHeaders;

export async function action({ request, context }: Route.ActionArgs) {
  const { cart } = context;

  const formData = await request.formData();

  const { action, inputs } = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (formDiscountCode ? [formDiscountCode] : []) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesAdd: {
      const formGiftCardCode = inputs.giftCardCode;

      const giftCardCodes = (formGiftCardCode ? [formGiftCardCode] : []) as string[];

      result = await cart.addGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes as string[];
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const { cart: cartResult, errors, warnings } = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    { status, headers }
  );
}

export async function loader({ context }: Route.LoaderArgs) {
  const { cart } = context;
  return await cart.get();
}

const Cart = () => {
  const cart = useLoaderData<typeof loader>();
  const hasItems = (cart?.totalQuantity ?? 0) > 0;

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 md:px-8">
      <div className="mb-8 text-center">
        <Heading as="h1" variant="quiet" className="font-semibold">
          Cart
        </Heading>
        {hasItems && (
          <TextLink to="/collections/summer-25" prefetch="intent" className="mt-2 inline-block">
            Continue shopping
          </TextLink>
        )}
      </div>
      <CartMain layout="page" cart={cart} />
    </div>
  );
};

export default Cart;
