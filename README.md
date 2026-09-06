# EggDirect - Egg Marketplace Platform

A comprehensive full-stack e-commerce platform for buying and selling eggs directly from suppliers. Built with Next.js, Prisma, and modern web technologies.

## Features

### For Buyers
- Browse and search egg products
- Add products to cart
- Secure checkout with multiple payment methods
- Order tracking and management
- Product ratings and reviews
- Account management and profiles

### For Suppliers
- Product listing and inventory management
- Order management dashboard
- Sales analytics and reporting
- Commission tracking
- Payout management
- Document verification for compliance

### For Admins
- User management
- Verification document approval
- Commission rate configuration
- Platform analytics and reporting
- Audit logs and system monitoring

## Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with secure cookies
- **Payment**: Integration-ready for payment gateways
- **Email**: Nodemailer for email notifications
- **Validation**: Zod for schema validation
- **Financial**: Decimal.js for precise calculations

## Project Structure

```
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # User dashboard
│   │   ├── marketplace/    # Product marketplace
│   │   ├── orders/         # Orders management
│   │   └── profile/        # User profile
│   ├── actions/            # Server actions
│   ├── lib/                # Utility libraries
│   │   ├── auth.ts         # Authentication utilities
│   │   ├── email.ts        # Email service
│   │   ├── payment.ts      # Payment provider
│   │   ├── payout.ts       # Payout provider
│   │   ├── storage.ts      # File storage
│   │   ├── notification.ts # Notifications
│   │   ├── financial.ts    # Financial calculations
│   │   ├── prisma.ts       # Prisma client
│   │   └── utils.ts        # General utilities
│   ├── types/              # TypeScript type definitions
│   │   ├── index.ts        # Core types
│   │   ├── validation.ts   # Zod schemas
│   │   └── utils.ts        # Utility types
│   └── middleware.ts       # Next.js middleware
├── messages/               # i18n translations
│   ├── en.json            # English translations
│   └── ur.json            # Urdu translations
├── prisma/
│   └── schema.prisma      # Database schema
├── public/                 # Static assets
└── .env.example           # Environment variables template
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/eddy437/EggDirect.git
cd EggDirect
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your database URL and other configs
```

4. Set up the database
```bash
npm run db:generate
npm run db:push
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - List products (with pagination and search)
- `GET /api/products?id={id}` - Get product details

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart` - Remove item from cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders?id={id}` - Get order details

### Payments
- `POST /api/payments` - Process payment

### Ratings
- `POST /api/ratings` - Create product rating
- `GET /api/ratings` - Get product ratings

## Database Schema

The application uses the following main entities:

- **Users** - User accounts with roles (BUYER, SUPPLIER, SHOP_OWNER, ADMIN)
- **Products** - Product listings with inventory management
- **Orders** - Customer orders with status tracking
- **Payments** - Payment transactions
- **Carts** - Shopping carts
- **Ratings** - Product reviews and ratings
- **VerificationDocs** - KYC/compliance documents
- **CommissionLedgers** - Commission tracking
- **Notifications** - User notifications

## Environment Variables

Create a `.env.local` file with the following:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/eggdirect"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Email
SMTP_HOST="localhost"
SMTP_PORT="1025"
SMTP_USER=""
SMTP_PASS=""
EMAIL_FROM="noreply@eggdirect.local"

# Payment Provider
PAYMENT_PROVIDER="mock" # or actual provider

# Storage Provider
STORAGE_PROVIDER="mock" # or actual provider

# Notification Provider
NOTIFICATION_PROVIDER="mock" # or actual provider

# Commission Rates
DEFAULT_COMMISSION_RATE="0.10"
PLATFORM_COMMISSION_RATE="0.05"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Contributing

Contributions are welcome! Please follow the existing code structure and conventions.

## License

MIT

## Support

For issues and questions, please create an issue on GitHub.
