# AgriGrow System Architecture

## Overview
AgriGrow is a full-stack agricultural platform that integrates crop production, animal husbandry, marketplace functionality, and agricultural consultancy services. The system follows a client-server architecture with a React frontend and Node.js/Express backend.

## Technology Stack

### Frontend (Client)
- **Framework**: React 19.1.1 with Vite
- **Routing**: React Router DOM 7.9.1
- **Styling**: Tailwind CSS 3.4.17
- **HTTP Client**: Axios 1.12.2
- **Build Tool**: Vite 7.1.6
- **Development Port**: 5173

### Backend (Server)
- **Runtime**: Node.js with Express 4.19.2
- **Database**: MongoDB with Mongoose 8.18.1
- **Authentication**: JWT (jsonwebtoken 9.0.2) + bcryptjs 3.0.2
- **Validation**: express-validator 7.2.1
- **CORS**: Enabled for localhost:5173
- **Development Port**: 3000

## System Architecture

### Database Models
1. **User** - Base farmer/agricultural user
2. **Doctor** - Agricultural consultants/veterinarians
3. **Customer** - Service consumers with medical history
4. **CropListing** - Crop sales listings
5. **CropSold** - Completed crop transactions
6. **Seed** - Seed inventory and sales
7. **Fertilizer** - Fertilizer inventory and sales
8. **CartItem** - Shopping cart functionality
9. **ItemBought** - Purchase history
10. **Appointment** - Doctor-customer appointments
11. **Transaction** - Financial transactions

### API Routes Structure
```
/api/auth - Authentication (login, register, token validation)
/api/seeds - Seed inventory and purchasing
/api/fertilizers - Fertilizer inventory and purchasing
/api/cart - Shopping cart management
/api/crop-listings - Crop marketplace
/api/payment - Payment processing
/api/transactions - Transaction history
/api/doctors - Doctor management and profiles
/api/customers - Customer management and profiles
/api/appointments - Appointment scheduling
```

### Frontend Pages Architecture
```
Landing → SelectRole → Registration/Login
├── Farmer Path
│   ├── Dashboard (main farmer dashboard)
│   ├── Agri (agricultural marketplace)
│   │   ├── Seeds
│   │   ├── Fertilizers
│   │   └── Sell (crop listings)
│   ├── Cattle (animal husbandry)
│   ├── Cart (shopping cart)
│   ├── Transactions
│   ├── CropHistory
│   └── Profile Management
├── Doctor Path
│   ├── DoctorDashboard
│   ├── DoctorEditProfile
│   └── Appointment Management
└── Customer Path
    ├── CustomerDashboard
    └── Medical Services
```

## Key Features

### 1. Multi-Role Authentication System
- **Farmers**: Primary users for crop production and marketplace
- **Doctors**: Agricultural consultants and veterinarians
- **Customers**: Service consumers for medical/consultation services

### 2. Agricultural Marketplace
- **Seeds**: Browse and purchase seeds
- **Fertilizers**: Browse and purchase fertilizers
- **Crop Listings**: Farmers can list crops for sale
- **Shopping Cart**: Multi-item purchase functionality

### 3. Animal Husbandry
- Cattle management system
- Cattle history tracking
- Integration with veterinary services

### 4. Consultation Services
- Doctor-customer appointment system
- Medical history tracking
- Report submission system

### 5. Financial Management
- Transaction tracking
- Payment processing
- Purchase history

### 6. Government Integration
- Government schemes information
- Regulatory compliance features

## Database Connection
- **Local MongoDB**: mongodb://127.0.0.1:27017/vishesh_app
- **Environment Variable**: MONGO_URI (for production/cloud deployment)
- **Connection Management**: Singleton pattern with reconnection handling

## Security Features
- Password hashing with bcryptjs
- JWT token-based authentication
- Input validation with express-validator
- CORS configuration for secure cross-origin requests
- Environment variable management for sensitive data

## Development Workflow
- **Backend Scripts**:
  - `npm start` - Start server
  - `npm run seed:seeds` - Load seed data
  - `npm run seed:fertilizers` - Load fertilizer data
- **Frontend Scripts**:
  - `npm run dev` - Development server
  - `npm run build` - Production build
  - `npm run lint` - Code linting

## Deployment Architecture
- **Frontend**: Static files served via Vite build
- **Backend**: Express server with MongoDB connection
- **Database**: MongoDB (local or Atlas cloud)
- **Environment**: Configurable via .env files

## Data Flow
1. **User Registration/Login** → JWT token generation
2. **Marketplace Browsing** → Product catalog retrieval
3. **Cart Management** → Session-based cart operations
4. **Purchase Flow** → Payment processing → Transaction recording
5. **Appointment Booking** → Doctor-customer matching → Scheduling
6. **Crop Listing** → Farmer product uploads → Marketplace integration

## Scalability Considerations
- Modular route structure for easy feature addition
- Separate models for different user types
- Middleware-based authentication for route protection
- Database indexing on frequently queried fields
- Environment-based configuration for different deployment stages

This architecture supports a comprehensive agricultural ecosystem with marketplace, consultation, and management features while maintaining scalability and security.