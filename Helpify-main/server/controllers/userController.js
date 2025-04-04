const { User, Role, Order } = require("../models");
const { Op } = require("sequelize");
const { fn, col } = require("sequelize");
const sequelize = require("sequelize");

// Get all customers (users with roleId 3)
const getAllCustomers = async (req, res) => {
  try {
    console.log("Fetching customers...");
    const customers = await User.findAll({
      where: {
        roleId: 3,
      },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "contact",
        "address",
        "createdAt",
        "updatedAt",
        "roleId",
        "status",
      ],
      order: [["createdAt", "DESC"]],
    });
    console.log(customers);
    console.log(`Found ${customers.length} customers`);

    // Transform the data to match the frontend expectations
    const transformedCustomers = customers.map((customer) => {
      const transformed = {
        id: customer.id,
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        phone: customer.contact || "N/A",
        createdAt: customer.createdAt,
        status: customer.status,
        orders: 0, // We'll implement order counting in the next phase
      };
      console.log("Transformed customer:", transformed);
      return transformed;
    });

    console.log("Sending response...");
    return res.json(transformedCustomers);
  } catch (error) {
    console.error("Error in getAllCustomers:", error);
    return res.status(500).json({
      message: "Error fetching customers",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Toggle user status
const toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    console.log(`Updating user ${id} status to ${status}`);

    // Validate status value
    if (!["active", "suspended"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value. Must be either 'active' or 'suspended'",
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.roleId !== 3) {
      return res.status(403).json({
        message: "Can only toggle status for customers",
      });
    }

    // Update the user's status
    await user.update({ status });

    console.log(`Successfully updated user ${id} status to ${status}`);

    // Return the updated user data
    res.json({
      message: "User status updated successfully",
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({
      message: "Error updating user status",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCustomers,
  toggleUserStatus,
};
