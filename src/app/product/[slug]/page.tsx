import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/api';
import { ProductDetailClient } from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Tiffin Wales',
    };
  }

  return {
    title: `${product.name} | Tiffin Wales Indian Food Cambridge & Boston`,
    description: product.description || `Order fresh ${product.name} for home delivery or pickup in Cambridge, MA.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.isVeg === product.isVeg)
    .slice(0, 4);

  return (
    <ProductDetailClient product={product} relatedProducts={relatedProducts} />
  );
}
