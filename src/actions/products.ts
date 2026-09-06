import { prisma } from '@/lib/prisma';
import type { Product } from '@/types';

export async function getProducts(skip = 0, take = 10): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
  });

  return products.map((p) => ({
    ...p,
    price: Number(p.price),
    costPrice: p.costPrice ? Number(p.costPrice) : undefined,
    discountPrice: p.discountPrice ? Number(p.discountPrice) : undefined,
    rating: Number(p.rating),
  }));
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) return null;

  return {
    ...product,
    price: Number(product.price),
    costPrice: product.costPrice ? Number(product.costPrice) : undefined,
    discountPrice: product.discountPrice ? Number(product.discountPrice) : undefined,
    rating: Number(product.rating),
  };
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: {
      category,
      isActive: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return products.map((p) => ({
    ...p,
    price: Number(p.price),
    costPrice: p.costPrice ? Number(p.costPrice) : undefined,
    discountPrice: p.discountPrice ? Number(p.discountPrice) : undefined,
    rating: Number(p.rating),
  }));
}

export async function searchProducts(query: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: {
      AND: [
        { isActive: true },
        {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
      ],
    },
  });

  return products.map((p) => ({
    ...p,
    price: Number(p.price),
    costPrice: p.costPrice ? Number(p.costPrice) : undefined,
    discountPrice: p.discountPrice ? Number(p.discountPrice) : undefined,
    rating: Number(p.rating),
  }));
}
