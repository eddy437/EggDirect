import { prisma } from '@/lib/prisma';
import type { Rating } from '@/types';

export async function createRating(
  productId: string,
  userId: string,
  rating: number,
  comment?: string,
  images?: string[]
): Promise<Rating> {
  const newRating = await prisma.rating.create({
    data: {
      productId,
      userId,
      rating,
      comment,
      images: images || [],
    },
  });

  // Update product rating
  const ratings = await prisma.rating.findMany({
    where: { productId },
  });

  const averageRating =
    ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: averageRating,
      reviewCount: ratings.length,
    },
  });

  return newRating as Rating;
}

export async function getRatingsByProductId(productId: string): Promise<Rating[]> {
  const ratings = await prisma.rating.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' },
  });

  return ratings as Rating[];
}
