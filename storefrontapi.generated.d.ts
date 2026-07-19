/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export type MoneyFragment = Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;

export type CartLineFragment = Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>>;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
  };
  parentRelationship?: StorefrontAPI.Maybe<{ parent: Pick<StorefrontAPI.CartLine, 'id'> }>;
};

export type CartLineComponentFragment = Pick<
  StorefrontAPI.ComponentizableCartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>>;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
  };
  lineComponents: Array<
    Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
      attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
      cost: {
        totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
        amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
        compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
        >;
      };
      merchandise: Pick<
        StorefrontAPI.ProductVariant,
        'id' | 'availableForSale' | 'requiresShipping' | 'title'
      > & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
        >;
        product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
        selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
      };
      parentRelationship?: StorefrontAPI.Maybe<{ parent: Pick<StorefrontAPI.CartLine, 'id'> }>;
    }
  >;
};

export type CartApiQueryFragment = Pick<
  StorefrontAPI.Cart,
  'updatedAt' | 'id' | 'checkoutUrl' | 'totalQuantity' | 'note'
> & {
  appliedGiftCards: Array<
    Pick<StorefrontAPI.AppliedGiftCard, 'id' | 'lastCharacters'> & {
      amountUsed: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    }
  >;
  buyerIdentity: Pick<StorefrontAPI.CartBuyerIdentity, 'countryCode' | 'email' | 'phone'> & {
    customer?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Customer, 'id' | 'email' | 'firstName' | 'lastName' | 'displayName'>
    >;
  };
  lines: {
    nodes: Array<
      | (Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'requiresShipping' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
            >;
            product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
            selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
          };
          parentRelationship?: StorefrontAPI.Maybe<{ parent: Pick<StorefrontAPI.CartLine, 'id'> }>;
        })
      | (Pick<StorefrontAPI.ComponentizableCartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'requiresShipping' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
            >;
            product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
            selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
          };
          lineComponents: Array<
            Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
              attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
              cost: {
                totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
                amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
                compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
                >;
              };
              merchandise: Pick<
                StorefrontAPI.ProductVariant,
                'id' | 'availableForSale' | 'requiresShipping' | 'title'
              > & {
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
                image?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
                >;
                product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
                selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
              };
              parentRelationship?: StorefrontAPI.Maybe<{
                parent: Pick<StorefrontAPI.CartLine, 'id'>;
              }>;
            }
          >;
        })
    >;
  };
  cost: {
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalDutyAmount?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>>;
    totalTaxAmount?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>>;
  };
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  discountCodes: Array<Pick<StorefrontAPI.CartDiscountCode, 'code' | 'applicable'>>;
};

export type MenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ChildMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ParentMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
> & {
  items: Array<
    Pick<StorefrontAPI.MenuItem, 'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'>
  >;
};

export type MenuFragment = Pick<StorefrontAPI.Menu, 'id'> & {
  items: Array<
    Pick<StorefrontAPI.MenuItem, 'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'> & {
      items: Array<
        Pick<StorefrontAPI.MenuItem, 'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'>
      >;
    }
  >;
};

export type ShopFragment = Pick<StorefrontAPI.Shop, 'id' | 'name' | 'description'> & {
  primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
  brand?: StorefrontAPI.Maybe<{
    logo?: StorefrontAPI.Maybe<{ image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>> }>;
  }>;
};

export type HeaderQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  headerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HeaderQuery = {
  shop: Pick<StorefrontAPI.Shop, 'id' | 'name' | 'description'> & {
    primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
    brand?: StorefrontAPI.Maybe<{
      logo?: StorefrontAPI.Maybe<{ image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>> }>;
    }>;
  };
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<StorefrontAPI.MenuItem, 'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'> & {
          items: Array<
            Pick<StorefrontAPI.MenuItem, 'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'>
          >;
        }
      >;
    }
  >;
};

export type FooterQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  footerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type FooterQuery = {
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<StorefrontAPI.MenuItem, 'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'> & {
          items: Array<
            Pick<StorefrontAPI.MenuItem, 'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'>
          >;
        }
      >;
    }
  >;
};

export type ProductCardFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'handle' | 'title' | 'vendor'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
  images: {
    nodes: Array<Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>>;
  };
  priceRange: { minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'> };
  editionNumber?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  editionStatus?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  colorSiblings?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Product, 'handle'> & {
          colorName?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
          colorHex?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        }
      >;
    }>;
  }>;
};

export type StoreRobotsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type StoreRobotsQuery = { shop: Pick<StorefrontAPI.Shop, 'id'> };

export type HomeProductsQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HomeProductsQuery = {
  collection?: StorefrontAPI.Maybe<{
    products: {
      nodes: Array<
        Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title' | 'vendor'> & {
          featuredImage?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
          >;
          images: {
            nodes: Array<Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>>;
          };
          priceRange: { minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'> };
          editionNumber?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
          editionStatus?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
          colorSiblings?: StorefrontAPI.Maybe<{
            references?: StorefrontAPI.Maybe<{
              nodes: Array<
                Pick<StorefrontAPI.Product, 'handle'> & {
                  colorName?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
                  colorHex?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
                }
              >;
            }>;
          }>;
        }
      >;
    };
  }>;
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title' | 'vendor'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
        >;
        images: {
          nodes: Array<Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>>;
        };
        priceRange: { minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'> };
        editionNumber?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        editionStatus?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        colorSiblings?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Product, 'handle'> & {
                colorName?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
                colorHex?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
              }
            >;
          }>;
        }>;
      }
    >;
  };
};

export type CollectionQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  filters?: StorefrontAPI.InputMaybe<
    Array<StorefrontAPI.ProductFilter> | StorefrontAPI.ProductFilter
  >;
  sortKey: StorefrontAPI.ProductCollectionSortKeys;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']['input']>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']['input']>;
  endCursor?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']['input']>;
}>;

export type CollectionQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title' | 'description'> & {
      marketingSections?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      products: {
        nodes: Array<
          Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title' | 'vendor'> & {
            label?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
            featuredImage?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
            >;
            images: {
              nodes: Array<
                Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
              >;
            };
            priceRange: { minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'> };
            editionNumber?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
            editionStatus?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
            colorSiblings?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  Pick<StorefrontAPI.Product, 'handle'> & {
                    colorName?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
                    colorHex?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
                  }
                >;
              }>;
            }>;
          }
        >;
        filters: Array<
          Pick<StorefrontAPI.Filter, 'id' | 'label' | 'type'> & {
            values: Array<Pick<StorefrontAPI.FilterValue, 'id' | 'label' | 'count' | 'input'>>;
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
      };
    }
  >;
};

export type DropQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type DropQuery = {
  metaobject?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metaobject, 'handle'> & {
      fields: Array<
        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
          reference?: StorefrontAPI.Maybe<{
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
            >;
          }>;
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title' | 'vendor'> & {
                featuredImage?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
                >;
                images: {
                  nodes: Array<
                    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
                  >;
                };
                priceRange: {
                  minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                };
                editionNumber?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
                editionStatus?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
                colorSiblings?: StorefrontAPI.Maybe<{
                  references?: StorefrontAPI.Maybe<{
                    nodes: Array<
                      Pick<StorefrontAPI.Product, 'handle'> & {
                        colorName?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
                        colorHex?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
                      }
                    >;
                  }>;
                }>;
              }
            >;
          }>;
        }
      >;
    }
  >;
};

export type DropsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type DropsQuery = {
  metaobjects: {
    nodes: Array<
      Pick<StorefrontAPI.Metaobject, 'handle'> & {
        fields: Array<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
            reference?: StorefrontAPI.Maybe<{
              image?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
              >;
            }>;
          }
        >;
      }
    >;
  };
};

export type JournalArticleQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type JournalArticleQuery = {
  blog?: StorefrontAPI.Maybe<{
    articleByHandle?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Article,
        'id' | 'handle' | 'title' | 'excerpt' | 'contentHtml' | 'publishedAt'
      > & {
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
        >;
      }
    >;
  }>;
};

export type JournalQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type JournalQuery = {
  blog?: StorefrontAPI.Maybe<{
    articles: {
      nodes: Array<
        Pick<StorefrontAPI.Article, 'id' | 'handle' | 'title' | 'excerpt' | 'publishedAt'>
      >;
    };
  }>;
};

export type PageQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type PageQuery = {
  page?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Page, 'handle' | 'id' | 'title' | 'body'> & {
      seo?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Seo, 'description' | 'title'>>;
    }
  >;
};

export type ContactPageQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ContactPageQuery = {
  page?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Page, 'id' | 'title' | 'body'>>;
};

export type PolicyFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'body' | 'handle' | 'id' | 'title' | 'url'
>;

export type PolicyQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  privacyPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  refundPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  shippingPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  termsOfService: StorefrontAPI.Scalars['Boolean']['input'];
}>;

export type PolicyQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
  };
};

export type PolicyItemFragment = Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>;

export type PoliciesQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type PoliciesQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>>;
    shippingPolicy?: StorefrontAPI.Maybe<Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>>;
    termsOfService?: StorefrontAPI.Maybe<Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>>;
    refundPolicy?: StorefrontAPI.Maybe<Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>>;
    subscriptionPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicyWithDefault, 'id' | 'title' | 'handle'>
    >;
  };
};

export type ProductVariantFragment = Pick<
  StorefrontAPI.ProductVariant,
  'availableForSale' | 'id' | 'sku' | 'title'
> & {
  compareAtPrice?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>>;
  image?: StorefrontAPI.Maybe<
    { __typename: 'Image' } & Pick<
      StorefrontAPI.Image,
      'id' | 'url' | 'altText' | 'width' | 'height'
    >
  >;
  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
  selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
  unitPrice?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>>;
};

export type ProductFragment = Pick<
  StorefrontAPI.Product,
  | 'id'
  | 'title'
  | 'vendor'
  | 'handle'
  | 'descriptionHtml'
  | 'description'
  | 'encodedVariantExistence'
  | 'encodedVariantAvailability'
> & {
  options: Array<
    Pick<StorefrontAPI.ProductOption, 'name'> & {
      optionValues: Array<
        Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
          firstSelectableVariant?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ProductVariant, 'availableForSale' | 'id' | 'sku' | 'title'> & {
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              image?: StorefrontAPI.Maybe<
                { __typename: 'Image' } & Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
              selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
              unitPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
            }
          >;
          swatch?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
              image?: StorefrontAPI.Maybe<{
                previewImage?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
              }>;
            }
          >;
        }
      >;
    }
  >;
  selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.ProductVariant, 'availableForSale' | 'id' | 'sku' | 'title'> & {
      compareAtPrice?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>>;
      image?: StorefrontAPI.Maybe<
        { __typename: 'Image' } & Pick<
          StorefrontAPI.Image,
          'id' | 'url' | 'altText' | 'width' | 'height'
        >
      >;
      price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
      selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
      unitPrice?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>>;
    }
  >;
  adjacentVariants: Array<
    Pick<StorefrontAPI.ProductVariant, 'availableForSale' | 'id' | 'sku' | 'title'> & {
      compareAtPrice?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>>;
      image?: StorefrontAPI.Maybe<
        { __typename: 'Image' } & Pick<
          StorefrontAPI.Image,
          'id' | 'url' | 'altText' | 'width' | 'height'
        >
      >;
      price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
      selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
      unitPrice?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>>;
    }
  >;
  seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
  fitNote?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  colorSiblings?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Product, 'handle'> & {
          colorName?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
          colorHex?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        }
      >;
    }>;
  }>;
  productDetails?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  techStack?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  specCard?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  editionNumber?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  editionStatus?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  environmentalHero?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
      >;
    }>;
  }>;
  environmentalHeroCaption?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  heroImage?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
      >;
    }>;
  }>;
  heroImageMobile?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
      >;
    }>;
  }>;
};

export type ProductQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  selectedOptions: Array<StorefrontAPI.SelectedOptionInput> | StorefrontAPI.SelectedOptionInput;
}>;

export type ProductQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      | 'id'
      | 'title'
      | 'vendor'
      | 'handle'
      | 'descriptionHtml'
      | 'description'
      | 'encodedVariantExistence'
      | 'encodedVariantAvailability'
    > & {
      options: Array<
        Pick<StorefrontAPI.ProductOption, 'name'> & {
          optionValues: Array<
            Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
              firstSelectableVariant?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.ProductVariant, 'availableForSale' | 'id' | 'sku' | 'title'> & {
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  image?: StorefrontAPI.Maybe<
                    { __typename: 'Image' } & Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
                  selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
                  unitPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                }
              >;
              swatch?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                  image?: StorefrontAPI.Maybe<{
                    previewImage?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
                  }>;
                }
              >;
            }
          >;
        }
      >;
      selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.ProductVariant, 'availableForSale' | 'id' | 'sku' | 'title'> & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            { __typename: 'Image' } & Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
          selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
          unitPrice?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>>;
        }
      >;
      adjacentVariants: Array<
        Pick<StorefrontAPI.ProductVariant, 'availableForSale' | 'id' | 'sku' | 'title'> & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            { __typename: 'Image' } & Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
          selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
          unitPrice?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>>;
        }
      >;
      seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
      fitNote?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      colorSiblings?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Product, 'handle'> & {
              colorName?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
              colorHex?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
            }
          >;
        }>;
      }>;
      productDetails?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      techStack?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      specCard?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      editionNumber?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      editionStatus?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      environmentalHero?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<{
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
          >;
        }>;
      }>;
      environmentalHeroCaption?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      heroImage?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<{
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
          >;
        }>;
      }>;
      heroImageMobile?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<{
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
          >;
        }>;
      }>;
    }
  >;
};

export type ProductRecommendationsQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ProductRecommendationsQuery = {
  product?: StorefrontAPI.Maybe<{
    recommended?: StorefrontAPI.Maybe<{
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title' | 'vendor'> & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
            >;
            images: {
              nodes: Array<
                Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
              >;
            };
            priceRange: { minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'> };
            editionNumber?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
            editionStatus?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
            colorSiblings?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  Pick<StorefrontAPI.Product, 'handle'> & {
                    colorName?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
                    colorHex?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
                  }
                >;
              }>;
            }>;
          }
        >;
      }>;
    }>;
  }>;
};

interface GeneratedQueryTypes {
  '#graphql\n  fragment Shop on Shop {\n    id\n    name\n    description\n    primaryDomain {\n      url\n    }\n    brand {\n      logo {\n        image {\n          url\n        }\n      }\n    }\n  }\n  query Header(\n    $country: CountryCode\n    $headerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      ...Shop\n    }\n    menu(handle: $headerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: HeaderQuery;
    variables: HeaderQueryVariables;
  };
  '#graphql\n  query Footer(\n    $country: CountryCode\n    $footerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    menu(handle: $footerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: FooterQuery;
    variables: FooterQueryVariables;
  };
  '#graphql\n  query StoreRobots($country: CountryCode, $language: LanguageCode)\n   @inContext(country: $country, language: $language) {\n    shop {\n      id\n    }\n  }\n': {
    return: StoreRobotsQuery;
    variables: StoreRobotsQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductCard on Product {\n    id\n    handle\n    title\n    vendor\n    featuredImage {\n      id\n      url\n      altText\n      width\n      height\n    }\n    # First two images: [0] is the resting card image, [1] crossfades in on\n    # hover (matches the live card\'s product-image-hover behavior).\n    images(first: 2) {\n      nodes {\n        id\n        url\n        altText\n        width\n        height\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    # Edition device (7PA-246): ED. XX · STATUS, rendered in the card\'s mono\n    # spec strip.\n    editionNumber: metafield(namespace: "custom", key: "edition_number") {\n      value\n    }\n    editionStatus: metafield(namespace: "custom", key: "edition_status") {\n      value\n    }\n    # Color = separate product: the ordered color family lives in the\n    # custom.color_siblings metafield (each sibling carries its own name/hex).\n    colorSiblings: metafield(namespace: "custom", key: "color_siblings") {\n      references(first: 10) {\n        nodes {\n          ... on Product {\n            handle\n            colorName: metafield(namespace: "custom", key: "color_name") {\n              value\n            }\n            colorHex: metafield(namespace: "custom", key: "color_hex") {\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n\n  query HomeProducts($handle: String!, $country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      products(first: 12) {\n        nodes {\n          ...ProductCard\n        }\n      }\n    }\n    products(first: 12) {\n      nodes {\n        ...ProductCard\n      }\n    }\n  }\n': {
    return: HomeProductsQuery;
    variables: HomeProductsQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductCard on Product {\n    id\n    handle\n    title\n    vendor\n    featuredImage {\n      id\n      url\n      altText\n      width\n      height\n    }\n    # First two images: [0] is the resting card image, [1] crossfades in on\n    # hover (matches the live card\'s product-image-hover behavior).\n    images(first: 2) {\n      nodes {\n        id\n        url\n        altText\n        width\n        height\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    # Edition device (7PA-246): ED. XX · STATUS, rendered in the card\'s mono\n    # spec strip.\n    editionNumber: metafield(namespace: "custom", key: "edition_number") {\n      value\n    }\n    editionStatus: metafield(namespace: "custom", key: "edition_status") {\n      value\n    }\n    # Color = separate product: the ordered color family lives in the\n    # custom.color_siblings metafield (each sibling carries its own name/hex).\n    colorSiblings: metafield(namespace: "custom", key: "color_siblings") {\n      references(first: 10) {\n        nodes {\n          ... on Product {\n            handle\n            colorName: metafield(namespace: "custom", key: "color_name") {\n              value\n            }\n            colorHex: metafield(namespace: "custom", key: "color_hex") {\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n\n  query Collection(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n    $filters: [ProductFilter!]\n    $sortKey: ProductCollectionSortKeys!\n    $reverse: Boolean\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      marketingSections: metafield(namespace: "custom", key: "marketing_sections") {\n        value\n      }\n      products(\n        first: $first\n        last: $last\n        before: $startCursor\n        after: $endCursor\n        filters: $filters\n        sortKey: $sortKey\n        reverse: $reverse\n      ) {\n        nodes {\n          ...ProductCard\n          label: metafield(namespace: "theme", key: "label") {\n            value\n          }\n        }\n        filters {\n          id\n          label\n          type\n          values {\n            id\n            label\n            count\n            input\n          }\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n      }\n    }\n  }\n': {
    return: CollectionQuery;
    variables: CollectionQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductCard on Product {\n    id\n    handle\n    title\n    vendor\n    featuredImage {\n      id\n      url\n      altText\n      width\n      height\n    }\n    # First two images: [0] is the resting card image, [1] crossfades in on\n    # hover (matches the live card\'s product-image-hover behavior).\n    images(first: 2) {\n      nodes {\n        id\n        url\n        altText\n        width\n        height\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    # Edition device (7PA-246): ED. XX · STATUS, rendered in the card\'s mono\n    # spec strip.\n    editionNumber: metafield(namespace: "custom", key: "edition_number") {\n      value\n    }\n    editionStatus: metafield(namespace: "custom", key: "edition_status") {\n      value\n    }\n    # Color = separate product: the ordered color family lives in the\n    # custom.color_siblings metafield (each sibling carries its own name/hex).\n    colorSiblings: metafield(namespace: "custom", key: "color_siblings") {\n      references(first: 10) {\n        nodes {\n          ... on Product {\n            handle\n            colorName: metafield(namespace: "custom", key: "color_name") {\n              value\n            }\n            colorHex: metafield(namespace: "custom", key: "color_hex") {\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n\n  query Drop($handle: String!, $country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    metaobject(handle: { type: "drop", handle: $handle }) {\n      handle\n      fields {\n        key\n        value\n        reference {\n          ... on MediaImage {\n            image { id url altText width height }\n          }\n        }\n        references(first: 12) {\n          nodes {\n            ... on Product {\n              ...ProductCard\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: DropQuery;
    variables: DropQueryVariables;
  };
  '#graphql\n  query Drops($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    metaobjects(type: "drop", first: 20) {\n      nodes {\n        handle\n        fields {\n          key\n          value\n          reference {\n            ... on MediaImage {\n              image { id url altText width height }\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: DropsQuery;
    variables: DropsQueryVariables;
  };
  '#graphql\n  query JournalArticle($handle: String!, $country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    blog(handle: "journal") {\n      articleByHandle(handle: $handle) {\n        id\n        handle\n        title\n        excerpt\n        contentHtml\n        publishedAt\n        image {\n          id\n          url\n          altText\n          width\n          height\n        }\n      }\n    }\n  }\n': {
    return: JournalArticleQuery;
    variables: JournalArticleQueryVariables;
  };
  '#graphql\n  query Journal($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    blog(handle: "journal") {\n      articles(first: 20, sortKey: PUBLISHED_AT, reverse: true) {\n        nodes {\n          id\n          handle\n          title\n          excerpt\n          publishedAt\n        }\n      }\n    }\n  }\n': {
    return: JournalQuery;
    variables: JournalQueryVariables;
  };
  '#graphql\n  query Page(\n    $language: LanguageCode,\n    $country: CountryCode,\n    $handle: String!\n  )\n  @inContext(language: $language, country: $country) {\n    page(handle: $handle) {\n      handle\n      id\n      title\n      body\n      seo {\n        description\n        title\n      }\n    }\n  }\n': {
    return: PageQuery;
    variables: PageQueryVariables;
  };
  '#graphql\n  query ContactPage($handle: String!, $country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    page(handle: $handle) {\n      id\n      title\n      body\n    }\n  }\n': {
    return: ContactPageQuery;
    variables: ContactPageQueryVariables;
  };
  '#graphql\n  fragment Policy on ShopPolicy {\n    body\n    handle\n    id\n    title\n    url\n  }\n  query Policy(\n    $country: CountryCode\n    $language: LanguageCode\n    $privacyPolicy: Boolean!\n    $refundPolicy: Boolean!\n    $shippingPolicy: Boolean!\n    $termsOfService: Boolean!\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      privacyPolicy @include(if: $privacyPolicy) {\n        ...Policy\n      }\n      shippingPolicy @include(if: $shippingPolicy) {\n        ...Policy\n      }\n      termsOfService @include(if: $termsOfService) {\n        ...Policy\n      }\n      refundPolicy @include(if: $refundPolicy) {\n        ...Policy\n      }\n    }\n  }\n': {
    return: PolicyQuery;
    variables: PolicyQueryVariables;
  };
  '#graphql\n  fragment PolicyItem on ShopPolicy {\n    id\n    title\n    handle\n  }\n  query Policies ($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    shop {\n      privacyPolicy {\n        ...PolicyItem\n      }\n      shippingPolicy {\n        ...PolicyItem\n      }\n      termsOfService {\n        ...PolicyItem\n      }\n      refundPolicy {\n        ...PolicyItem\n      }\n      subscriptionPolicy {\n        id\n        title\n        handle\n      }\n    }\n  }\n': {
    return: PoliciesQuery;
    variables: PoliciesQueryVariables;
  };
  '#graphql\n  query Product(\n    $country: CountryCode\n    $handle: String!\n    $language: LanguageCode\n    $selectedOptions: [SelectedOptionInput!]!\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      ...Product\n    }\n  }\n  #graphql\n  fragment Product on Product {\n    id\n    title\n    vendor\n    handle\n    descriptionHtml\n    description\n    encodedVariantExistence\n    encodedVariantAvailability\n    options {\n      name\n      optionValues {\n        name\n        firstSelectableVariant {\n          ...ProductVariant\n        }\n        swatch {\n          color\n          image {\n            previewImage {\n              url\n            }\n          }\n        }\n      }\n    }\n    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {\n      ...ProductVariant\n    }\n    adjacentVariants (selectedOptions: $selectedOptions) {\n      ...ProductVariant\n    }\n    seo {\n      description\n      title\n    }\n    fitNote: metafield(namespace: "custom", key: "fit_note") {\n      value\n    }\n    colorSiblings: metafield(namespace: "custom", key: "color_siblings") {\n      references(first: 10) {\n        nodes {\n          ... on Product {\n            handle\n            colorName: metafield(namespace: "custom", key: "color_name") {\n              value\n            }\n            colorHex: metafield(namespace: "custom", key: "color_hex") {\n              value\n            }\n          }\n        }\n      }\n    }\n    productDetails: metafield(namespace: "custom", key: "product_details") {\n      value\n    }\n    techStack: metafield(namespace: "custom", key: "tech_stack") {\n      value\n    }\n    # The Spec Card (7PA-231) — the locked seven-field JSON device\n    # (fabric/weight/use/seams/pockets/fit/origin); see lib/productContent.\n    specCard: metafield(namespace: "custom", key: "spec_card") {\n      value\n    }\n    # Edition device (7PA-246) — rendered above the product name.\n    editionNumber: metafield(namespace: "custom", key: "edition_number") {\n      value\n    }\n    editionStatus: metafield(namespace: "custom", key: "edition_status") {\n      value\n    }\n    # Below-the-fold environmental hero + caption (locked PDP order step 6).\n    # Imagery lands with the photography program (7PA-236); renders if present.\n    environmentalHero: metafield(namespace: "custom", key: "environmental_hero") {\n      reference {\n        ... on MediaImage {\n          image {\n            id\n            url\n            altText\n            width\n            height\n          }\n        }\n      }\n    }\n    environmentalHeroCaption: metafield(namespace: "custom", key: "environmental_hero_caption") {\n      value\n    }\n    # Dedicated PDP hero images (the theme\'s "Background Image" / "…Mobile"),\n    # per product. Falls back to the variant image when unset.\n    heroImage: metafield(namespace: "custom", key: "hero_image") {\n      reference {\n        ... on MediaImage {\n          image {\n            id\n            url\n            altText\n            width\n            height\n          }\n        }\n      }\n    }\n    heroImageMobile: metafield(namespace: "custom", key: "hero_image_mobile") {\n      reference {\n        ... on MediaImage {\n          image {\n            id\n            url\n            altText\n            width\n            height\n          }\n        }\n      }\n    }\n  }\n  #graphql\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    id\n    image {\n      __typename\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n    selectedOptions {\n      name\n      value\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n  }\n\n\n': {
    return: ProductQuery;
    variables: ProductQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductCard on Product {\n    id\n    handle\n    title\n    vendor\n    featuredImage {\n      id\n      url\n      altText\n      width\n      height\n    }\n    # First two images: [0] is the resting card image, [1] crossfades in on\n    # hover (matches the live card\'s product-image-hover behavior).\n    images(first: 2) {\n      nodes {\n        id\n        url\n        altText\n        width\n        height\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    # Edition device (7PA-246): ED. XX · STATUS, rendered in the card\'s mono\n    # spec strip.\n    editionNumber: metafield(namespace: "custom", key: "edition_number") {\n      value\n    }\n    editionStatus: metafield(namespace: "custom", key: "edition_status") {\n      value\n    }\n    # Color = separate product: the ordered color family lives in the\n    # custom.color_siblings metafield (each sibling carries its own name/hex).\n    colorSiblings: metafield(namespace: "custom", key: "color_siblings") {\n      references(first: 10) {\n        nodes {\n          ... on Product {\n            handle\n            colorName: metafield(namespace: "custom", key: "color_name") {\n              value\n            }\n            colorHex: metafield(namespace: "custom", key: "color_hex") {\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n\n  query ProductRecommendations($handle: String!, $country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      recommended: metafield(namespace: "custom", key: "recommended_products") {\n        references(first: 10) {\n          nodes {\n            ... on Product {\n              ...ProductCard\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: ProductRecommendationsQuery;
    variables: ProductRecommendationsQueryVariables;
  };
}

interface GeneratedMutationTypes {}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
