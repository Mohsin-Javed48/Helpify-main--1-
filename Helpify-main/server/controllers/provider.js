const { User, Role, Service, ServiceProvider } = require("../models");
const { generateHash } = require("../helper/hash");
const { Op } = require("sequelize");
const db = require("../models");

// Function to add a Service Provider
const registerProvider = async (req, res) => {
  try {
    const { userId, designation, location, ratePerHour, experience } = req.body;

    // Validate required fields
    if (!userId || !designation) {
      return res.status(400).json({
        success: false,
        message: "User ID and designation are required",
      });
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is already a service provider
    const existingProvider = await ServiceProvider.findOne({
      where: { userId },
    });
    if (existingProvider) {
      return res.status(400).json({
        success: false,
        message: "User is already registered as a service provider",
      });
    }

    // Create new service provider
    const newProvider = await ServiceProvider.create({
      userId,
      designation,
      location,
      ratePerHour: ratePerHour || 0,
      experience: experience || 0,
      status: "pending", // Default status
      isVerified: false, // Default verification status
      availabilityStatus: "offline", // Default availability
      joinedDate: new Date(),
    });

    // Update user role to service provider (assuming roleId 2 is service provider)
    await user.update({ roleId: 2 });

    return res.status(201).json({
      success: true,
      message: "Service provider registered successfully",
      provider: newProvider,
    });
  } catch (error) {
    console.error("Error registering service provider:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register service provider",
      error: error.message,
    });
  }
};

// Get all service providers
const getAllProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.findAll({
      include: [
        {
          model: User,
          where: { roleId: 2 }, // Only get users with roleId 2 (Provider)
          attributes: ["firstName", "lastName", "email", "status"],
        },
      ],
    });

    // Transform the data to match frontend expectations
    const transformedProviders = providers.map((provider) => ({
      id: provider.id,
      name: `${provider.User.firstName} ${provider.User.lastName}`,
      email: provider.User.email,
      contact: provider.User.contact || "N/A",
      createdAt: provider.joinedDate,
      status: provider.User.status,
      designation: provider.designation,
    }));

    return res.json(transformedProviders);
  } catch (error) {
    console.error("Error fetching service providers:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch service providers",
      error: error.message,
    });
  }
};

// Get service provider by ID
const getProviderById = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await ServiceProvider.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName", "email"],
        },
      ],
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Service provider not found",
      });
    }

    return res.status(200).json({
      success: true,
      provider,
    });
  } catch (error) {
    console.error("Error fetching service provider:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch service provider",
      error: error.message,
    });
  }
};

// Get service provider by user ID
const getProviderByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const provider = await ServiceProvider.findOne({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName", "email"],
        },
      ],
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Service provider not found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      provider,
    });
  } catch (error) {
    console.error("Error fetching service provider:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch service provider",
      error: error.message,
    });
  }
};

// Update service provider
const updateProvider = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const {
      designation,
      location,
      ratePerHour,
      experience,
      status,
      availabilityStatus,
      isVerified,
    } = req.body;

    // Find the provider with associated user
    const provider = await ServiceProvider.findByPk(id, {
      include: [{ model: User }],
      transaction,
    });

    if (!provider) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Service provider not found",
      });
    }

    // Update provider
    await provider.update(
      {
        designation: designation || provider.designation,
        location: location || provider.location,
        ratePerHour: ratePerHour || provider.ratePerHour,
        experience: experience || provider.experience,
        availabilityStatus: availabilityStatus || provider.availabilityStatus,
        isVerified: isVerified !== undefined ? isVerified : provider.isVerified,
        lastActive: new Date(),
      },
      { transaction }
    );

    // Update associated user's status if provided
    if (status && provider.User) {
      await provider.User.update(
        {
          status: status,
        },
        { transaction }
      );
    }

    await transaction.commit();

    // Fetch the updated provider with user details
    const updatedProvider = await ServiceProvider.findByPk(id, {
      include: [{ model: User }],
    });

    return res.status(200).json({
      success: true,
      message: "Service provider updated successfully",
      provider: {
        id: updatedProvider.id,
        name: `${updatedProvider.User.firstName} ${updatedProvider.User.lastName}`,
        email: updatedProvider.User.email,
        contact: updatedProvider.User.contact || "N/A",
        createdAt: updatedProvider.joinedDate,
        status: updatedProvider.User.status,
        designation: updatedProvider.designation,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating service provider:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update service provider",
      error: error.message,
    });
  }
};

// Update availability status
const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { availabilityStatus } = req.body;

    if (!availabilityStatus) {
      return res.status(400).json({
        success: false,
        message: "Availability status is required",
      });
    }

    // Find the provider
    const provider = await ServiceProvider.findByPk(id);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Service provider not found",
      });
    }

    // Update provider availability
    await provider.update({
      availabilityStatus,
      lastActive: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Availability status updated successfully",
      provider,
    });
  } catch (error) {
    console.error("Error updating availability status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update availability status",
      error: error.message,
    });
  }
};

const addService = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const providerId = req.user.id; // Assuming the user ID is stored in req.user after authentication

    const service = await Service.create({
      name,
      description,
      price,
      providerId,
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get provider dashboard stats
const getProviderStats = async (req, res) => {
  try {
    // Get provider ID from request params or authenticated user
    const providerId = req.params.id || req.providerId;

    // Check if provider exists
    const provider = await ServiceProvider.findByPk(providerId);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Service provider not found",
      });
    }

    const { Order, OrderBid } = require("../models");

    // Get total orders assigned to this provider
    const totalOrders = await Order.count({
      where: {
        serviceProviderId: providerId,
      },
    });

    // Get completed orders
    const completedOrders = await Order.count({
      where: {
        serviceProviderId: providerId,
        status: "completed",
      },
    });

    // Calculate total earnings
    const earningsResult = await Order.sum("amount", {
      where: {
        serviceProviderId: providerId,
        status: "completed",
        paymentStatus: "completed",
      },
    });
    const totalEarnings = earningsResult || 0;

    // Get average rating
    const ratingResult = await Order.findOne({
      attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avgRating"]],
      where: {
        serviceProviderId: providerId,
        rating: {
          [Op.not]: null,
        },
      },
      raw: true,
    });
    const avgRating = ratingResult?.avgRating
      ? parseFloat(ratingResult.avgRating).toFixed(1)
      : 0;

    // Count pending bids
    const pendingBids = await OrderBid.count({
      where: {
        serviceProviderId: providerId,
        status: "pending",
      },
    });

    // Count active orders (in progress)
    const activeOrders = await Order.count({
      where: {
        serviceProviderId: providerId,
        status: "in_progress",
      },
    });

    // Return stats
    return res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        completedOrders,
        totalEarnings,
        avgRating,
        pendingBids,
        activeOrders,
      },
    });
  } catch (error) {
    console.error("Error fetching provider stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch provider stats",
      error: error.message,
    });
  }
};

// Get provider recent activity
const getProviderRecentActivity = async (req, res) => {
  try {
    // Get provider ID from request params or authenticated user
    const providerId = req.params.id || req.providerId;

    // Check if provider exists
    const provider = await ServiceProvider.findByPk(providerId);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Service provider not found",
      });
    }

    const { Order, OrderBid, User } = require("../models");

    // Get recent bids
    const recentBids = await OrderBid.findAll({
      where: {
        serviceProviderId: providerId,
      },
      include: [
        {
          model: Order,
          as: "order",
          attributes: ["orderNumber", "amount", "scheduledDate", "status"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    // Get recent orders
    const recentOrders = await Order.findAll({
      where: {
        serviceProviderId: providerId,
      },
      include: [
        {
          model: User,
          as: "customer",
          attributes: ["firstName", "lastName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    // Format activities
    const activities = [
      ...recentBids.map((bid) => ({
        id: `bid_${bid.id}`,
        type:
          bid.status === "accepted"
            ? "bid_accepted"
            : bid.status === "counter_offered"
            ? "counter_offer"
            : "new_bid",
        message: `You ${
          bid.status === "accepted"
            ? "won the bid"
            : bid.status === "counter_offered"
            ? "received a counter offer"
            : "placed a bid"
        } on order #${bid.order.orderNumber}`,
        timestamp: bid.updatedAt,
        amount: bid.bidPrice,
        status: bid.status,
        orderId: bid.orderId,
      })),
      ...recentOrders.map((order) => ({
        id: `order_${order.id}`,
        type: order.status === "completed" ? "completed" : "active_order",
        message: `Order #${order.orderNumber} was ${order.status}`,
        timestamp: order.updatedAt,
        amount: order.amount,
        status: order.status,
        orderId: order.id,
        customerName:
          `${order.customer?.firstName || ""} ${
            order.customer?.lastName || ""
          }`.trim() || "Customer",
      })),
    ];

    // Sort by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.status(200).json({
      success: true,
      activities: activities.slice(0, 10), // Get at most 10 activities
    });
  } catch (error) {
    console.error("Error fetching provider activity:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch provider activity",
      error: error.message,
    });
  }
};

module.exports = {
  registerProvider,
  getAllProviders,
  getProviderById,
  getProviderByUserId,
  updateProvider,
  updateAvailability,
  addService,
  getProviderStats,
  getProviderRecentActivity,
};
