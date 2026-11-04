/** The numeric tail of a Shopify GID (`gid://shopify/ProductVariant/42?x=1` → `42`); a bare id passes through. */
export const gidNumericId = (id: string): string => {
  const [path = ''] = id.split('?');
  return path.slice(path.lastIndexOf('/') + 1);
};
