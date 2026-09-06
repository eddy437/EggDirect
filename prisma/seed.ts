import { PrismaClient } from '@prisma/client';
import Decimal from 'decimal.js';

const prisma = new PrismaClient();

const COMMISSION_RATE = new Decimal('0.10'); // 10%
const PLATFORM_COMMISSION_RATE = new Decimal('0.05'); // 5%

async function main() {
  // Clear existing data
  await prisma.idempotencyKey.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.message.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.inventoryReservation.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.commissionLedger.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.verificationDoc.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log('✓ Cleared all data');

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@eggdirect.local',
      password: '$2a$10$O9Qt6mHlHYL19JexJ5.1O.wWEy8Z5g1R8qZeprof.z8P5UJWnzHu2', // password: "admin123"
      firstName: 'Admin',
      lastName: 'User',
      phone: '+923001234567',
      role: 'ADMIN',
      isEmailVerified: true,
      isPhoneVerified: true,
      emailVerifiedAt: new Date(),
      phoneVerifiedAt: new Date(),
    },
  });

  console.log('✓ Created admin user');

  // Create supplier users
  const supplier1 = await prisma.user.create({
    data: {
      email: 'supplier1@eggdirect.local',
      password: '$2a$10$O9Qt6mHlHYL19JexJ5.1O.wWEy8Z5g1R8qZeprof.z8P5UJWnzHu2', // password: "supplier123"
      firstName: 'Farhan',
      lastName: 'Ali',
      phone: '+923001111111',
      role: 'SUPPLIER',
      isEmailVerified: true,
      isPhoneVerified: true,
      emailVerifiedAt: new Date(),
      phoneVerifiedAt: new Date(),
    },
  });

  const supplier2 = await prisma.user.create({
    data: {
      email: 'supplier2@eggdirect.local',
      password: '$2a$10$O9Qt6mHlHYL19JexJ5.1O.wWEy8Z5g1R8qZeprof.z8P5UJWnzHu2',
      firstName: 'Aisha',
      lastName: 'Khan',
      phone: '+923001111112',
      role: 'SUPPLIER',
      isEmailVerified: true,
      isPhoneVerified: true,
      emailVerifiedAt: new Date(),
      phoneVerifiedAt: new Date(),
    },
  });

  console.log('✓ Created supplier users');

  // Create shop owner
  const shopOwner = await prisma.user.create({
    data: {
      email: 'shopowner@eggdirect.local',
      password: '$2a$10$O9Qt6mHlHYL19JexJ5.1O.wWEy8Z5g1R8qZeprof.z8P5UJWnzHu2',
      firstName: 'Hassan',
      lastName: 'Ahmed',
      phone: '+923001111113',
      role: 'SHOP_OWNER',
      isEmailVerified: true,
      isPhoneVerified: true,
      emailVerifiedAt: new Date(),
      phoneVerifiedAt: new Date(),
    },
  });

  console.log('✓ Created shop owner');

  // Create buyer users
  const buyer1 = await prisma.user.create({
    data: {
      email: 'buyer1@eggdirect.local',
      password: '$2a$10$O9Qt6mHlHYL19JexJ5.1O.wWEy8Z5g1R8qZeprof.z8P5UJWnzHu2',
      firstName: 'Zainab',
      lastName: 'Hassan',
      phone: '+923001111114',
      role: 'BUYER',
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  const buyer2 = await prisma.user.create({
    data: {
      email: 'buyer2@eggdirect.local',
      password: '$2a$10$O9Qt6mHlHYL19JexJ5.1O.wWEy8Z5g1R8qZeprof.z8P5UJWnzHu2',
      firstName: 'Omar',
      lastName: 'Malik',
      phone: '+923001111115',
      role: 'BUYER',
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('✓ Created buyer users');

  // Create verification documents
  await prisma.verificationDoc.create({
    data: {
      userId: supplier1.id,
      documentType: 'NATIONAL_ID',
      documentNumber: '12345-6789012-1',
      documentUrl: '/documents/supplier1-id.jpg',
      status: 'APPROVED',
      approvedAt: new Date(),
      approvedBy: admin.id,
    },
  });

  await prisma.verificationDoc.create({
    data: {
      userId: supplier2.id,
      documentType: 'PASSPORT',
      documentNumber: 'AB123456',
      documentUrl: '/documents/supplier2-passport.jpg',
      status: 'APPROVED',
      approvedAt: new Date(),
      approvedBy: admin.id,
    },
  });

  console.log('✓ Created verification documents');

  // Create shops
  const shop1 = await prisma.shop.create({
    data: {
      ownerId: supplier1.id,
      name: "Farhan's Fresh Eggs",
      description: 'Fresh and organic eggs from local farms',
      city: 'Lahore',
      country: 'Pakistan',
      phone: '+923001111111',
      email: 'farhan@eggdirect.local',
      isVerified: true,
      isActive: true,
    },
  });

  const shop2 = await prisma.shop.create({
    data: {
      ownerId: supplier2.id,
      name: "Aisha's Premium Eggs",
      description: 'Premium and quality assured eggs',
      city: 'Karachi',
      country: 'Pakistan',
      phone: '+923001111112',
      email: 'aisha@eggdirect.local',
      isVerified: true,
      isActive: true,
    },
  });

  console.log('✓ Created shops');

  // Create products
  const product1 = await prisma.product.create({
    data: {
      supplierId: supplier1.id,
      shopId: shop1.id,
      name: 'Brown Eggs - Dozen',
      description: 'Fresh brown eggs collected daily',
      sku: 'BROWN-EGGS-12-001',
      category: 'eggs',
      price: new Decimal('500'),
      costPrice: new Decimal('250'),
      quantity: 100,
      unit: 'dozen',
      images: ['/products/brown-eggs-1.jpg', '/products/brown-eggs-2.jpg'],
      isActive: true,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      supplierId: supplier1.id,
      shopId: shop1.id,
      name: 'White Eggs - Dozen',
      description: 'Fresh white eggs from farm',
      sku: 'WHITE-EGGS-12-001',
      category: 'eggs',
      price: new Decimal('450'),
      costPrice: new Decimal('225'),
      quantity: 150,
      unit: 'dozen',
      images: ['/products/white-eggs-1.jpg'],
      isActive: true,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      supplierId: supplier2.id,
      shopId: shop2.id,
      name: 'Organic Free-Range Eggs - Dozen',
      description: 'Certified organic free-range eggs',
      sku: 'ORG-FREE-RANGE-12-001',
      category: 'eggs',
      price: new Decimal('700'),
      costPrice: new Decimal('350'),
      quantity: 80,
      unit: 'dozen',
      images: ['/products/organic-eggs-1.jpg', '/products/organic-eggs-2.jpg'],
      isActive: true,
    },
  });

  console.log('✓ Created products');

  // Create cart for buyer1
  const cart = await prisma.cart.create({
    data: {
      userId: buyer1.id,
      total: new Decimal('1000'),
    },
  });

  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: product1.id,
      quantity: 2,
      price: new Decimal('500'),
    },
  });

  console.log('✓ Created cart with items');

  // Create addresses
  await prisma.address.create({
    data: {
      userId: buyer1.id,
      type: 'shipping',
      street: '123 Main Street',
      city: 'Lahore',
      state: 'Punjab',
      postalCode: '54000',
      country: 'Pakistan',
      phone: '+923001111114',
      isDefault: true,
    },
  });

  await prisma.address.create({
    data: {
      userId: buyer2.id,
      type: 'shipping',
      street: '456 Park Road',
      city: 'Karachi',
      state: 'Sindh',
      postalCode: '75500',
      country: 'Pakistan',
      phone: '+923001111115',
      isDefault: true,
    },
  });

  console.log('✓ Created addresses');

  // Create an order
  const order = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024-001',
      buyerId: buyer1.id,
      shopId: shop1.id,
      status: 'CONFIRMED',
      paymentStatus: 'COMPLETED',
      subtotal: new Decimal('1000'),
      shippingCost: new Decimal('100'),
      tax: new Decimal('110'),
      total: new Decimal('1210'),
      shippingAddress: JSON.stringify({
        street: '123 Main Street',
        city: 'Lahore',
        state: 'Punjab',
        postalCode: '54000',
        country: 'Pakistan',
      }),
      escrowStatus: 'HELD',
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: product1.id,
      supplierId: supplier1.id,
      quantity: 2,
      price: new Decimal('500'),
      subtotal: new Decimal('1000'),
    },
  });

  console.log('✓ Created order with items');

  // Create payment
  await prisma.payment.create({
    data: {
      orderId: order.id,
      userId: buyer1.id,
      amount: new Decimal('1210'),
      method: 'CREDIT_CARD',
      status: 'COMPLETED',
      reference: 'PAY-2024-001',
      transactionId: 'TXN-123456789',
      paidAt: new Date(),
    },
  });

  console.log('✓ Created payment');

  // Create commission ledger
  const supplierEarnings = new Decimal('1000')
    .minus(new Decimal('1000').times(COMMISSION_RATE));
  const platformCommission = new Decimal('1000').times(COMMISSION_RATE);

  await prisma.commissionLedger.create({
    data: {
      orderId: order.id,
      supplierId: supplier1.id,
      orderTotal: new Decimal('1000'),
      supplierEarnings,
      platformCommission,
      commissionRate: COMMISSION_RATE,
    },
  });

  console.log('✓ Created commission ledger');

  // Create ratings
  await prisma.rating.create({
    data: {
      productId: product1.id,
      userId: buyer1.id,
      rating: 5,
      comment: 'Excellent quality eggs!',
      images: [],
    },
  });

  console.log('✓ Created ratings');

  // Create notifications
  await prisma.notification.create({
    data: {
      userId: buyer1.id,
      type: 'ORDER_CONFIRMED',
      title: 'Order Confirmed',
      message: 'Your order ORD-2024-001 has been confirmed',
    },
  });

  await prisma.notification.create({
    data: {
      userId: supplier1.id,
      type: 'NEW_MESSAGE',
      title: 'New Order Received',
      message: 'You have received a new order from a buyer',
    },
  });

  console.log('✓ Created notifications');

  // Create audit logs
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'APPROVE',
      entityType: 'VerificationDoc',
      entityId: (await prisma.verificationDoc.findFirst())?.id || '',
      status: 'success',
    },
  });

  console.log('✓ Created audit logs');

  console.log('\n✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('\n❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
