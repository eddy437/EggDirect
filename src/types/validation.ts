import { z } from 'zod';

// Auth Schemas
export const SignUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().regex(/^\+?[0-9]{10,}$/, 'Invalid phone number'),
  role: z.enum(['BUYER', 'SUPPLIER', 'SHOP_OWNER']),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type SignUpInput = z.infer<typeof SignUpSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const PasswordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Product Schemas
export const ProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255),
  description: z.string().max(5000).optional(),
  category: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be positive'),
  costPrice: z.number().positive().optional(),
  discountPrice: z.number().positive().optional(),
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
  unit: z.string().min(1, 'Unit is required'),
  images: z.array(z.string().url()).optional(),
});

export type ProductInput = z.infer<typeof ProductSchema>;

// Cart Schemas
export const AddToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;

// Order Schemas
export const CreateOrderSchema = z.object({
  shippingAddressId: z.string().min(1, 'Shipping address is required'),
  billingAddressId: z.string().optional(),
  paymentMethod: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'WALLET', 'CASH_ON_DELIVERY']),
  notes: z.string().max(500).optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

// Address Schemas
export const AddressSchema = z.object({
  type: z.enum(['billing', 'shipping']),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().regex(/^\+?[0-9]{10,}$/, 'Invalid phone number'),
  isDefault: z.boolean().optional(),
});

export type AddressInput = z.infer<typeof AddressSchema>;

// Verification Schemas
export const UploadVerificationDocSchema = z.object({
  documentType: z.enum(['NATIONAL_ID', 'PASSPORT', 'BANK_STATEMENT', 'TAX_CERTIFICATE', 'BUSINESS_LICENSE']),
  documentNumber: z.string().min(1, 'Document number is required'),
  expiryDate: z.string().datetime().optional(),
});

export type UploadVerificationDocInput = z.infer<typeof UploadVerificationDocSchema>;

// Rating Schemas
export const RatingSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().max(5000).optional(),
  images: z.array(z.string().url()).optional(),
});

export type RatingInput = z.infer<typeof RatingSchema>;

// Pagination
export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type PaginationInput = z.infer<typeof PaginationSchema>;
