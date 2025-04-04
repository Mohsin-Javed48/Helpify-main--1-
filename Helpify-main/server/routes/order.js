const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const { authenticate } = require("../middlewares/authenticate");
const { Order, RejectedOrder } = require("../models");

// Route to create a new order
router.post("/", authenticate, orderController.createOrder);

// Route to get all orders (admin only)
router.get("/", authenticate, orderController.getOrders);

// Route to get a specific order by ID
router.get("/:id", authenticate, orderController.getOrderById);

// Route to get orders by user ID
router.get("/user/:userId", authenticate, orderController.getOrdersByUserId);

// Route to get orders by service provider ID
router.get(
  "/provider/:providerId",
  authenticate,
  orderController.getOrdersByProviderId
);

// Route to get orders by service provider ID and status
router.get(
  "/provider/:providerId/:status",
  authenticate,
  orderController.getOrdersByProviderIdAndStatus
);

// Route to update order status
router.patch("/:id/status", authenticate, orderController.updateOrderStatus);

// Route to update payment status
router.patch("/:id/payment", authenticate, orderController.updatePaymentStatus);

// Route to assign a service provider to an order
router.patch(
  "/:id/assign",
  authenticate,
  orderController.assignServiceProvider
);

// Route for service provider to reject an order
router.post("/:id/reject", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { providerId } = req.body;

    // Validate required data
    if (!id || !providerId) {
      return res.status(400).json({
        success: false,
        message: "Order ID and provider ID are required",
      });
    }

    // Find the order
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Record the rejection in RejectedOrder model
    await RejectedOrder.create({
      orderId: id,
      serviceProviderId: providerId,
    });

    // If the order was assigned to this provider, update its status
    if (order.serviceProviderId === providerId) {
      await order.update({
        status: "provider_rejected",
        serviceProviderId: null, // Remove the provider assignment
      });
    }

    // Notify the customer that their order was rejected
    const io = req.app.get("io");
    if (io && order.userId) {
      io.to(`customer_${order.userId}`).emit("order_rejected", {
        orderId: order.id,
        providerId,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order rejected successfully",
    });
  } catch (error) {
    console.error("Error rejecting order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reject order",
      error: error.message,
    });
  }
});

module.exports = router;
