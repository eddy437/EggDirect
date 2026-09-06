// User Types
export type UserRole = 'BUYER' | 'SUPPLIER' | 'SHOP_OWNER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}

// Product Types
export interface Product {
  id: string;
  supplierId: string;
  shopId?: string;
  name: string;
  description?: string;
  sku: string;
  category: string;
  price: number;
  costPrice?: number;
  discountPrice?: number;
  quantity: number;
  reservedQuantity: number;
  unit: string;
  images: string[];
  isActive: boolean;
  rating: number;
  reviewCount: number;
  viewCount: number;
  saleCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';

export type PaymentMethod =
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'BANK_TRANSFER'
  | 'WALLET'
  | 'CASH_ON_DELIVERY';

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  shopId: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  supplierId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
}

// Payment Types
export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  reference: string;
  paidAt?: Date;
  failureReason?: string;
}

// Verification Types
export type DocumentType = 'NATIONAL_ID' | 'PASSPORT' | 'BANK_STATEMENT' | 'TAX_CERTIFICATE' | 'BUSINESS_LICENSE';

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export interface VerificationDoc {
  id: string;
  userId: string;
  documentType: DocumentType;
  documentNumber: string;
  documentUrl: string;
  status: VerificationStatus;
  approvedAt?: Date;
  approvedBy?: string;
  rejectionReason?: string;
  expiryDate?: Date;
}

// Rating Types
export interface Rating {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  images: string[];
  createdAt: Date;
}

// Notification Types
export type NotificationType =
  | 'ORDER_CONFIRMED'
  | 'ORDER_SHIPPED'
  | 'ORDER_DELIVERED'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_FAILED'
  | 'REFUND_INITIATED'
  | 'REFUND_COMPLETED'
  | 'VERIFICATION_APPROVED'
  | 'VERIFICATION_REJECTED'
  | 'PAYOUT_INITIATED'
  | 'PAYOUT_COMPLETED'
  | 'NEW_MESSAGE'
  | 'SYSTEM_ALERT';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

// Commission Types
export interface CommissionLedger {
  id: string;
  orderId: string;
  supplierId: string;
  orderTotal: number;
  supplierEarnings: number;
  platformCommission: number;
  commissionRate: number;
}

// Payout Types
export interface Payout {
  id: string;
  supplierId: string;
  amount: number;
  status: PaymentStatus;
  method: string;
  transactionId?: string;
  completedAt?: Date;
  failureReason?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
