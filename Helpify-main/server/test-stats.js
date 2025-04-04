const {
  ServiceProvider,
  Order,
  OrderBid,
  User,
  sequelize,
} = require("./models");
const { Op } = require("sequelize");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

async function testProviderStats() {
  try {
    console.log("Testing provider stats functionality...");

    // Get a sample provider
    const provider = await ServiceProvider.findOne({
      include: [{ model: User }],
    });

    if (!provider) {
      console.error("No service provider found in the database");
      return;
    }

    console.log(
      `Found provider ID: ${provider.id}, userId: ${provider.userId}`
    );

    // Test stats calculation
    // Count total orders
    const totalOrders = await Order.count({
      where: {
        serviceProviderId: provider.id,
      },
    });

    // Get completed orders
    const completedOrders = await Order.count({
      where: {
        serviceProviderId: provider.id,
        status: "completed",
      },
    });

    // Calculate total earnings
    const earningsResult = await Order.sum("amount", {
      where: {
        serviceProviderId: provider.id,
        status: "completed",
        paymentStatus: "completed",
      },
    });
    const totalEarnings = earningsResult || 0;

    // Get average rating
    const ratingResult = await Order.findOne({
      attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avgRating"]],
      where: {
        serviceProviderId: provider.id,
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
        serviceProviderId: provider.id,
        status: "pending",
      },
    });

    // Count active orders (in progress)
    const activeOrders = await Order.count({
      where: {
        serviceProviderId: provider.id,
        status: "in_progress",
      },
    });

    // Print stats
    console.log("Provider Stats Results:");
    console.log({
      totalOrders,
      completedOrders,
      totalEarnings,
      avgRating,
      pendingBids,
      activeOrders,
    });

    // Test recent activity
    // Get recent bids
    const recentBids = await OrderBid.findAll({
      where: {
        serviceProviderId: provider.id,
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

    console.log(`Found ${recentBids.length} recent bids`);

    // Get recent orders
    const recentOrders = await Order.findAll({
      where: {
        serviceProviderId: provider.id,
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

    console.log(`Found ${recentOrders.length} recent orders`);

    // Generate a JWT token for the user
    await testAPICall(provider);

    // Test successful
    console.log("Stats calculation test completed successfully");
  } catch (error) {
    console.error("Error testing provider stats:", error);
  } finally {
    // Close database connection
    await sequelize.close();
  }
}

async function testAPICall(provider) {
  try {
    console.log("\nTesting API endpoints...");

    if (!provider || !provider.User) {
      console.error("Provider or provider.User not found");
      return;
    }

    // Generate a JWT token for the provider's user
    const user = provider.User;
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );

    console.log(`Generated test token for user ID: ${user.id}`);

    // Set base URL
    const baseURL = "http://localhost:3000/api";

    // Test the stats endpoint
    console.log("\nTesting /provider/stats endpoint...");
    const statsResponse = await axios.get(`${baseURL}/provider/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Stats API Response:", statsResponse.data);

    // Test the recent activity endpoint
    console.log("\nTesting /provider/recent-activity endpoint...");
    const activityResponse = await axios.get(
      `${baseURL}/provider/recent-activity`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Activity API Response:", activityResponse.data);

    return true;
  } catch (error) {
    console.error("Error testing API:", error.response?.data || error.message);
    return false;
  }
}

// Run the test
testProviderStats();
