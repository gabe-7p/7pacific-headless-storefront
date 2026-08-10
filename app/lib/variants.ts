import type { SelectedOption } from '@shopify/hydrogen/storefront-api-types';
import { useMemo } from 'react';

export const useVariantUrl = (handle: string, selectedOptions?: Array<SelectedOption>) => {
  return useMemo(() => getVariantUrl({ handle, selectedOptions }), [handle, selectedOptions]);
};

const getVariantUrl = ({
  handle,
  selectedOptions,
}: {
  handle: string;
  selectedOptions?: Array<SelectedOption>;
}) => {
  const searchParams = new URLSearchParams();
  selectedOptions?.forEach((option) => {
    searchParams.set(option.name, option.value);
  });

  const searchString = searchParams.toString();
  return `/products/${handle}${searchString ? `?${searchString}` : ''}`;
};
