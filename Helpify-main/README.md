# Helpify - Home Services App with Bidding System

Helpify is a home services booking platform that enables customers to book various home services like plumbing, electrical work, painting, etc. The app features a bidding system where customers can create service requests and receive competitive bids from service providers.

## Key Features

- User authentication (customer, service provider, admin)
- Service browsing and selection
- Order creation and management
- Real-time bidding system
- Counter-offer negotiation
- Service provider notifications

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL database
- NPM or Yarn

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd Helpify
   ```

2. Install dependencies for both client and server:

   ```
   cd client && npm install
   cd ../server && npm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the server directory with the following variables:
     ```
     PORT=3000
     DB_USERNAME=postgres
     DB_PASSWORD=your_password
     DB_DATABASE=helpify
     DB_HOST=localhost
     DB_DIALECT=postgres
     JWT_SECRET=your_jwt_secret
     ```

4. Run database migrations:

   ```
   cd server
   npm run db:migrate
   ```

5. Start the server:

   ```
   npm run dev
   ```

6. Start the client (in a new terminal):

   ```
   cd client
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:5173`

## Testing the Bidding System

### As a Customer:

1. Register or log in as a customer
2. Browse and select services
3. Choose date and time
4. Enter your address
5. Select "Get Bids from Service Providers"
6. Wait for notifications about new bids
7. View bids, accept or make counter offers
8. Complete the booking after accepting a bid

### As a Service Provider:

1. Register or log in as a service provider
2. Go to the Notifications page
3. View incoming order requests
4. Submit bids for orders that match your services
5. Negotiate with customers by accepting or declining counter offers
6. View accepted bids and get ready to provide the service

## API Endpoints

### Bidding System

- `POST /api/bids` - Create a new bid
- `GET /api/bids/order/:orderId` - Get all bids for an order
- `POST /api/bids/counter-offer/:bidId` - Submit a counter offer
- `POST /api/bids/accept/:bidId` - Accept a bid
- `POST /api/bids/reject/:bidId` - Reject a bid
- `GET /api/bids/provider/:providerId` - Get all bids by a service provider

## License

This project is licensed under the MIT License.

## Introduction

Helpify is an on-demand services platform designed to connect users with skilled professionals for home maintenance, cleaning, and personal care services. Whether you need a plumber, an electrician, a carpenter, or a beautician, Helpify provides a seamless and reliable way to book expert services at your convenience.

## Features

- **Wide Range of Services**: Plumbing, electrical work, carpentry, AC installation and repair, cleaning, car maintenance, beauty services, and more.
- **Easy Booking**: Users can schedule services through the Helpify website or mobile app.
- **Verified Professionals**: All service providers are background-checked and certified for quality assurance.
- **Transparent Pricing**: Competitive market rates with no hidden charges.
- **Real-Time Tracking**: Track your service requests and professional arrival status.
- **Secure Payments**: Multiple payment options including online transactions and cash on delivery.
- **24/7 Customer Support**: Dedicated support team to assist users at any time.

## Installation

To set up Helpify locally:

```sh
# Clone the repository
git clone https://github.com/Mohsin-Javed48/Helpify.git

# Navigate to the project directory
cd helpify

# Install dependencies
npm i

# Start the development server
npm run dev
```
