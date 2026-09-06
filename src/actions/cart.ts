import { prisma } from '@/lib/prisma';
import type { CartItem } from '@/types';

export async function getCart(userId: string) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId, total: 0 },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  return cart;
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity: number
): Promise<CartItem> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  if (product.quantity - product.reservedQuantity < quantity) {
    throw new Error('Insufficient stock');
  }

  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId, total: 0 },
    });
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  let cartItem;

  if (existingItem) {
    cartItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    });
  } else {
    cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        price: product.price,
      },
    });
  }

  // Update cart total
  const items = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: { product: true },
  });

  const total = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

  await prisma.cart.update({
    where: { id: cart.id },
    data: { total: total.toString() },
  });

  return cartItem;
}

export async function removeFromCart(userId: string, cartItemId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new Error('Cart not found');
  }

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  // Update cart total
  const items = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: { product: true },
  });

  const total = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

  await prisma.cart.update({
    where: { id: cart.id },
    data: { total: total.toString() },
  });
}

export async function clearCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) return;

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  await prisma.cart.update({
    where: { id: cart.id },
    data: { total: '0' },
  });
}
