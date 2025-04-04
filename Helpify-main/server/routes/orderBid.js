const express = require("express");
const router = express.Router();
const orderBidController = require("../controllers/orderBid");
const { authenticate } = require("../middlewares/authenticate");

// Create a new bid
router.post("/", authenticate, orderBidController.createBid);

// Get bids by order ID
router.get(
  "/order/:orderId",
  authenticate,
  orderBidController.getBidsByOrderId
);

// Customer counter offer on a bid
router.post(
  "/counter-offer/:bidId",
  authenticate,
  orderBidController.customerCounterOffer
);

// Accept a bid (by customer)
router.post("/accept/:bidId", authenticate, orderBidController.acceptBid);

// Reject a bid (by customer)
router.post("/reject/:bidId", authenticate, orderBidController.rejectBid);

// Get bids by service provider ID
router.get(
  "/provider/:providerId",
  authenticate,
  orderBidController.getBidsByProviderId
);

// Get counter offers for a service provider
router.get(
  "/provider/:providerId/counter-offers",
  authenticate,
  orderBidController.getCounterOffersByProviderId
);

module.exports = router;
