# Backend Services Documentation

## Overview

The Royal Saffron e-commerce platform uses a **file-based JSON database system** for data storage. All backend services are implemented as Next.js API routes that handle authentication, data management, and business logic.

## Architecture

### Data Storage
- **Location**: `/data` directory in the project root
- **Files**:
  - `users.json` - User accounts and authentication data
  - `orders.json` - Customer orders
  - `leads.json` - Lead inquiries from the website

### Database Utilities
**File**: `src/app/lib/db.ts`
- Provides generic file read/write operations
- Ensures data directory exists
- Type-safe database operations
- Handles JSON serialization/deserialization

## API Endpoints

### Authentication Services

#### 1. User Registration
- **Endpoint**: `POST /api/auth/register`
- **Purpose**: Create new user account
- **Features**:
  - Email validation
  - Password hashing (bcrypt, 12 rounds)
  - Phone number validation
  - Duplicate email check
  - Automatic login after registration (JWT token)

#### 2. User Login
- **Endpoint**: `POST /api/auth/login`
- **Purpose**: Authenticate user and create session
- **Features**:
  - Email/password verification
  - JWT token generation
  - HTTP-only cookie for session management
  - 7-day token expiration

#### 3. Get Current User
- **Endpoint**: `GET /api/auth/me`
- **Purpose**: Retrieve authenticated user's data
- **Features**:
  - JWT token verification
  - Returns user data without password hash

#### 4. User Logout
- **Endpoint**: `POST /api/auth/logout`
- **Purpose**: Clear authentication session
- **Features**:
  - Clears HTTP-only cookie

#### 5. Change Password
- **Endpoint**: `POST /api/auth/change-password`
- **Purpose**: Update user password
- **Features**:
  - Current password verification
  - New password validation (min 8 characters)
  - Password hashing

#### 6. Forgot Password (Send OTP)
- **Endpoint**: `POST /api/auth/forgot-password`
- **Purpose**: Initiate password reset process
- **Features**:
  - Email validation
  - 6-digit OTP generation
  - OTP storage with 5-minute expiration
  - Development mode: Returns OTP in response (remove in production!)

#### 7. Reset Password (Verify OTP)
- **Endpoint**: `PUT /api/auth/forgot-password`
- **Purpose**: Complete password reset with OTP verification
- **Features**:
  - OTP verification
  - Password update
  - OTP expiration check

#### 8. Update Address
- **Endpoint**: `PUT /api/auth/update-address`
- **Purpose**: Save/update shipping or billing address
- **Features**:
  - Address validation
  - Phone and pincode validation
  - Separate shipping/billing addresses

### Order Services

#### 1. Create Order
- **Endpoint**: `POST /api/orders`
- **Purpose**: Create new order
- **Features**:
  - Order ID generation
  - Total calculation (subtotal + shipping)
  - Address validation
  - Order status: "pending"

#### 2. Get User Orders
- **Endpoint**: `GET /api/orders`
- **Purpose**: Retrieve all orders for authenticated user
- **Features**:
  - Sorted by most recent first
  - User authentication required

#### 3. Get Order Details
- **Endpoint**: `GET /api/orders/[orderId]`
- **Purpose**: Get specific order details
- **Features**:
  - Order ownership verification
  - Complete order information

#### 4. Track Order
- **Endpoint**: `GET /api/orders/[orderId]/track`
- **Purpose**: Get order tracking information
- **Features**:
  - Courier service integration
  - Tracking URL generation
  - Tracking status updates
  - Supports major Indian courier services

### Lead Management

#### 1. Create Lead
- **Endpoint**: `POST /api/leads`
- **Purpose**: Capture customer inquiries
- **Features**:
  - Form validation
  - WhatsApp notification generation
  - Lead storage
  - Lead status tracking

## Security Features

### Password Security
- **Hashing**: bcrypt with 12 salt rounds
- **Minimum Length**: 8 characters
- **Storage**: Never stored in plain text

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Token Expiration**: 7 days
- **Secure Flag**: Enabled in production

### Data Validation
- Email format validation
- Phone number validation (10 digits)
- Pincode validation (6 digits)
- Input sanitization

### OTP Security
- 6-digit numeric OTP
- 5-minute expiration
- Single-use (deleted after verification)
- In-memory storage (use Redis in production)

## Data Models

### User Model
```typescript
{
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  phone: string;
  createdAt: string;
  verified: boolean;
  shippingAddress?: Address;
  billingAddress?: Address;
}
```

### Order Model
```typescript
{
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  courierService?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Lead Model
```typescript
{
  id: string;
  name: string;
  email: string;
  phone: string;
  query: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
}
```

## Production Considerations

### Current Implementation (Development)
- File-based JSON storage
- In-memory OTP storage
- Console logging for OTPs
- No email service integration

### Production Recommendations

1. **Database Migration**
   - Move from JSON files to PostgreSQL/MongoDB
   - Implement connection pooling
   - Add database backups

2. **OTP Service**
   - Use Redis for OTP storage
   - Integrate SMS service (Twilio, AWS SNS)
   - Integrate Email service (SendGrid, AWS SES)

3. **Security Enhancements**
   - Rate limiting on auth endpoints
   - CSRF protection
   - Request validation middleware
   - Environment variable for JWT_SECRET

4. **Email Integration**
   - Send OTP via email
   - Order confirmation emails
   - Password reset emails

5. **Monitoring**
   - Error logging (Sentry, LogRocket)
   - Performance monitoring
   - Security audit logging

## Environment Variables

Required environment variables:
```env
JWT_SECRET=your-secret-key-change-in-production
NEXT_PUBLIC_WHATSAPP_PHONE=919876543210
NODE_ENV=production
```

## File Structure

```
src/app/
├── api/
│   ├── auth/
│   │   ├── register/route.ts
│   │   ├── login/route.ts
│   │   ├── logout/route.ts
│   │   ├── me/route.ts
│   │   ├── change-password/route.ts
│   │   ├── forgot-password/route.ts
│   │   └── update-address/route.ts
│   ├── orders/
│   │   ├── route.ts
│   │   └── [orderId]/
│   │       ├── route.ts
│   │       └── track/route.ts
│   └── leads/route.ts
└── lib/
    ├── db.ts (Database utilities)
    ├── auth.ts (Authentication utilities)
    ├── otp.ts (OTP generation/verification)
    └── tracking.ts (Order tracking)
```

## Testing

All endpoints can be tested using:
- Browser DevTools Network tab
- Postman/Insomnia
- curl commands
- Frontend integration

## Notes

- The current implementation is suitable for development and small-scale production
- For high-traffic applications, migrate to a proper database
- OTP functionality is ready for email/SMS service integration
- All sensitive operations require authentication
- Data is persisted to disk immediately after operations
