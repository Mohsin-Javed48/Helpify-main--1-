# Bidding System Implementation

## Overview

The bidding system implementation enables a marketplace-like experience where service providers can bid on service requests created by customers. This document outlines the key components and workflow of the bidding system.

## Architecture Components

### Database Models

1. **OrderBid Model**
   - Stores bids from service providers
   - Tracks original price, bid price, counter offers
   - Manages bid status (pending, accepted, rejected, counter-offered)
   - Associates bids with orders and service providers

### Server-side Components

1. **Socket.IO Server**

   - Implements real-time communication between customers and service providers
   - Manages socket rooms for customers and service providers
   - Dispatches events for bids, counter offers, and acceptances

2. **OrderBid Controller**

   - Creates new bids
   - Handles counter offers
   - Processes bid acceptance/rejection
   - Retrieves bids for orders

3. **Order Controller**
   - Notifies service providers with matching skills when new orders are created
   - Manages order status transitions during the bidding process

### Client-side Components

1. **ServiceBidding Component**

   - Displays bids to customers
   - Enables counter offers
   - Allows accepting or rejecting bids

2. **Notification Component**

   - Shows new order requests to service providers
   - Enables providers to submit bids
   - Displays counter-offers from customers
   - Notifies providers of bid acceptance/rejection

3. **BookingForm Component**
   - Provides option to create a regular order or a bid-enabled order
   - Redirects to bid viewing page after creating a bid-enabled order

## Workflow

### Customer Side

1. Customer creates an order with selected services, address, and schedule
2. Customer chooses "Get Bids from Service Providers" option
3. System creates the order without assigning a service provider
4. Customer is redirected to a bid viewing page
5. Customer receives and views incoming bids in real-time
6. Customer can:
   - Accept a bid directly
   - Make a counter offer
   - Reject a bid
7. After accepting a bid, the order is updated with the selected provider and price

### Service Provider Side

1. Service provider receives notifications about new orders matching their skills
2. Provider can view order details in their notification panel
3. Provider can:
   - Submit a bid with a price and optional message
   - Reject the order opportunity
4. Provider receives notifications about counter offers from customers
5. Provider can accept or reject counter offers
6. Provider receives confirmation when their bid is accepted

## Technical Implementation

1. **WebSocket Rooms**

   - `provider_{id}` - Room for each service provider
   - `customer_{id}` - Room for each customer

2. **Socket Events**

   - `new_order_request` - Sent to providers when a matching order is created
   - `new_bid` - Sent to customers when a provider submits a bid
   - `counter_offer` - Sent to providers when a customer makes a counter offer
   - `bid_accepted` - Sent to providers when their bid is accepted
   - `bid_rejected` - Sent to providers when their bid is rejected

3. **Data Flow**
   - Orders -> Matched to providers by service category/designation
   - Bids -> Associated with specific orders and providers
   - Counter offers -> Updates to existing bids

## Security Considerations

- Authentication middleware protects all bid-related API endpoints
- Validation ensures bids can only be submitted by verified service providers
- Order validation prevents duplicate bids from the same provider

## Future Enhancements

1. Bid expiration mechanism
2. Provider rating factor in matching algorithm
3. Distance-based provider matching
4. Real-time chat between customer and provider during negotiation
5. Multi-provider comparison view for customers
