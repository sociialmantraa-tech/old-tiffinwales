import React from 'react';
import { getProducts } from '@/lib/api';
import { TiffinShopCatalog } from '@/components/TiffinShopCatalog';

export const metadata = {
  title: 'Tiffin | Tiffin Wales Indian Food Cambridge & Boston',
  description: 'Explore authentic Indian tiffin meal plans (2, 3, 4, 5, 7 Days), curries, breads and desserts for delivery and pickup across Cambridge & Boston.',
};

export default async function TiffinPage() {
  const products = await getProducts();

  return <TiffinShopCatalog initialProducts={products} />;
}
