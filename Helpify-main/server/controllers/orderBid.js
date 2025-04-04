const { OrderBid, ServiceProvider, Order, User } = require("../models");
const { sequelize } = require("../models");
const { Op } = require("sequelize");

// Create a new bid from service provider
const createBid = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { orderId, serviceProviderId, bidPrice, bidMessage } = req.body;

    // Validate required fields
    if (!orderId || !serviceProviderId || !bidPrice) {
      return res.status(400).json({
        success: false,
        message: "Order ID, service provider ID, and bid price are required",
      });
    }

    // Check if order exists
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if service provider exists
    const provider = await ServiceProvider.findByPk(serviceProviderId);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Service provider not found",
      });
    }

    // Check if a bid already exists from this provider for this order
    const existingBid = await OrderBid.findOne({
      where: {
        orderId,
        serviceProviderId,
      },
    });

    if (existingBid) {
      return res.status(400).json({
        success: false,
        message:
          "A bid from this service provider already exists for this order",
      });
    }

    // Calculate original price from order
    const originalPrice = order.amount;

    // Create the bid
    const newBid = await OrderBid.create(
      {
        orderId,
        serviceProviderId,
        originalPrice,
        bidPrice,
        bidMessage,
        status: "pending",
      },
      { transaction }
    );

    await transaction.commit();

    // Get the io instance to emit socket events
    const io = req.app.get("io");

    // Notify the customer of the new bid
    if (order.userId) {
      io.to(`customer_${order.userId}`).emit("new_bid", {
        bid: newBid,
        provider: {
          id: provider.id,
          name: provider.name || "Service Provider", // You may need to join with user data for the name
          designation: provider.designation,
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: "Bid created successfully",
      bid: newBid,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating bid:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create bid",
      error: error.message,
    });
  }
};

// Get all bids for an order
const getBidsByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    const bids = await OrderBid.findAll({
      where: { orderId },
      include: [
        {
          model: ServiceProvider,
          as: "provider",
          // Remove the nested include to avoid the SQL error
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Process the bids to add provider details
    const processedBids = bids.map((bid) => {
      const bidObj = bid.get({ plain: true });

      // Add placeholder provider details if needed
      if (bidObj.provider) {
        bidObj.name = bidObj.provider.designation || "Service Provider";
        bidObj.image = "https://randomuser.me/api/portraits/men/32.jpg"; // Default image
        bidObj.rating = bidObj.provider.rating || 4.5;
        bidObj.completedOrders = bidObj.provider.completedOrders || 0;
      }

      return bidObj;
    });

    return res.status(200).json({
      success: true,
      count: processedBids.length,
      bids: processedBids,
    });
  } catch (error) {
    console.error("Error fetching bids:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching bids",
      error: error.message,
    });
  }
};

// Customer counter offer on a bid
const customerCounterOffer = async (req, res) => {
  try {
    const { bidId } = req.params;
    const { counterOfferPrice } = req.body;

    if (!counterOfferPrice) {
      return res.status(400).json({
        success: false,
        message: "Counter offer price is required",
      });
    }

    // Find the bid
    const bid = await OrderBid.findByPk(bidId, {
      include: [
        { model: Order, as: "order" },
        { model: ServiceProvider, as: "provider" },
      ],
    });

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "Bid not found",
      });
    }

    // Update the bid with counter offer and status
    await bid.update({
      customerCounterOffer: counterOfferPrice,
      status: "counter_offered",
    });

    // Get the io instance to emit socket events
    const io = req.app.get("io");

    // Notify the service provider of the counter offer
    io.to(`provider_${bid.serviceProviderId}`).emit("counter_offer", {
      bid: bid,
      counterOfferPrice,
    });

    return res.status(200).json({
      success: true,
      message: "Counter offer submitted successfully",
      bid,
    });
  } catch (error) {
    console.error("Error submitting counter offer:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit counter offer",
      error: error.message,
    });
  }
};

// Accept a bid (by customer)
const acceptBid = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { bidId } = req.params;

    console.log(`Accepting bid with ID: ${bidId}`);

    // Find the bid
    const bid = await OrderBid.findByPk(bidId, {
      include: [{ model: Order, as: "order" }],
    });

    if (!bid) {
      console.log(`Bid not found with ID: ${bidId}`);
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Bid not found",
      });
    }

    console.log(`Found bid: `, JSON.stringify(bid, null, 2));

    if (!bid.order) {
      console.log(`Order not found for bid ID: ${bidId}`);
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Order associated with this bid not found",
      });
    }

    // Update the bid status
    await bid.update(
      {
        status: "accepted",
      },
      { transaction }
    );

    console.log(`Updated bid status to accepted`);

    // Prepare the data for order update
    const updatedData = {
      serviceProviderId: bid.serviceProviderId,
      amount: bid.customerCounterOffer || bid.bidPrice, // Use counter offer if exists, otherwise use bid price
      originalAmount: bid.originalPrice,
      isNegotiated: true,
      status: "accepted",
    };

    console.log(`Updating order with data:`, updatedData);

    try {
      // Update the order with the service provider and negotiated price
      await bid.order.update(updatedData, { transaction });
      console.log(`Order updated successfully`);
    } catch (error) {
      console.error(`Error updating order:`, error);
      await transaction.rollback();
      return res.status(500).json({
        success: false,
        message: "Failed to update order",
        error: error.message,
      });
    }

    try {
      // Reject all other bids for this order
      await OrderBid.update(
        {
          status: "rejected",
        },
        {
          where: {
            orderId: bid.orderId,
            id: { [Op.ne]: bid.id }, // All bids except the accepted one
          },
          transaction,
        }
      );
      console.log(`Rejected other bids for this order`);
    } catch (error) {
      console.error(`Error rejecting other bids:`, error);
      await transaction.rollback();
      return res.status(500).json({
        success: false,
        message: "Failed to reject other bids",
        error: error.message,
      });
    }

    await transaction.commit();
    console.log(`Transaction committed successfully`);

    // Get the io instance to emit socket events
    try {
      const io = req.app.get("io");
      if (io) {
        // Notify the service provider that their bid was accepted
        io.to(`provider_${bid.serviceProviderId}`).emit("bid_accepted", {
          bid: bid,
          order: bid.order,
        });
        console.log(
          `Socket notification sent to provider ${bid.serviceProviderId}`
        );
      } else {
        console.log(`Socket instance not available`);
      }
    } catch (socketError) {
      console.error(`Error sending socket notification:`, socketError);
      // Don't fail the request due to socket error
    }

    return res.status(200).json({
      success: true,
      message: "Bid accepted successfully",
      bid,
      order: bid.order,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error accepting bid:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to accept bid",
      error: error.message,
      stack: error.stack,
    });
  }
};

// Reject a bid (by customer)
const rejectBid = async (req, res) => {
  try {
    const { bidId } = req.params;

    // Find the bid
    const bid = await OrderBid.findByPk(bidId);

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "Bid not found",
      });
    }

    // Update the bid status
    await bid.update({
      status: "rejected",
    });

    // Get the io instance to emit socket events
    const io = req.app.get("io");

    // Notify the service provider that their bid was rejected
    io.to(`provider_${bid.serviceProviderId}`).emit("bid_rejected", {
      bidId: bid.id,
      orderId: bid.orderId,
    });

    return res.status(200).json({
      success: true,
      message: "Bid rejected successfully",
    });
  } catch (error) {
    console.error("Error rejecting bid:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reject bid",
      error: error.message,
    });
  }
};

// Get bids submitted by a service provider
const getBidsByProviderId = async (req, res) => {
  try {
    const { providerId } = req.params;

    const bids = await OrderBid.findAll({
      where: { serviceProviderId: providerId },
      include: [{ model: Order, as: "order" }],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: bids.length,
      bids,
    });
  } catch (error) {
    console.error("Error fetching provider bids:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching provider bids",
      error: error.message,
    });
  }
};

// Get counter offers for a service provider
const getCounterOffersByProviderId = async (req, res) => {
  try {
    const { providerId } = req.params;

    if (!providerId) {
      return res.status(400).json({
        success: false,
        message: "Provider ID is required",
      });
    }

    // Find bids with counter offers for this provider
    const counterOffers = await OrderBid.findAll({
      where: {
        serviceProviderId: providerId,
        status: "counter_offered",
        customerCounterOffer: {
          [Op.not]: null,
        },
      },
      include: [
        {
          model: Order,
          as: "order",
          attributes: [
            "id",
            "orderNumber",
            "scheduledDate",
            "amount",
            "status",
          ],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: counterOffers.length,
      counterOffers,
    });
  } catch (error) {
    console.error("Error fetching counter offers:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch counter offers",
      error: error.message,
    });
  }
};

module.exports = {
  createBid,
  getBidsByOrderId,
  customerCounterOffer,
  acceptBid,
  rejectBid,
  getBidsByProviderId,
  getCounterOffersByProviderId,
};
