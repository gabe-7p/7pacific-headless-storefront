import type { SelectedOption } from '@shopify/hydrogen/storefront-api-types';
import { useMemo } from 'react';
import { useLocation } from 'react-router';

export const useVariantUrl = (handle: string, selectedOptions?: Array<SelectedOption>) => {
  const { pathname } = useLocation();

  return useMemo(() => {
    return getVariantUrl({
      handle,
      pathname,
      searchParams: new URLSearchParams(),
      selectedOptions,
    });
  }, [handle, selectedOptions, pathname]);
};

const getVariantUrl = ({
  handle,
  pathname,
  searchParams,
  selectedOptions,
}: {
  handle: string;
  pathname: string;
  searchParams: URLSearchParams;
  selectedOptions?: Array<SelectedOption>;
}) => {
  const match = /(\/[a-zA-Z]{2}-[a-zA-Z]{2}\/)/g.exec(pathname);
  const localePrefix = match?.[0];

  const path = localePrefix ? `${localePrefix}products/${handle}` : `/products/${handle}`;

  selectedOptions?.forEach((option) => {
    searchParams.set(option.name, option.value);
  });

  const searchString = searchParams.toString();

  return path + (searchString ? '?' + searchParams.toString() : '');
};
