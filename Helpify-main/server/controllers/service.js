const multer = require("multer");
const path = require("path");
const { Service, Order } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

// 📌 Service creation function
const createService = async (req, res) => {
  console.log("hello");
  try {
    const {
      name,
      description,
      price,
      category,
      total_orders,
      total_providers,
    } = req.body;
    console.log(req.body);

    console.log(req.body);
    if (!name || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 📌 Save the uploaded image path if available
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // 📌 Create new service with image and category
    const newService = await Service.create({
      name,
      description,
      price,
      category,
      image: imagePath, // Save image path in DB
      total_orders,
      total_providers,
    });

    res
      .status(201)
      .json({ message: "Service created successfully", newService });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get services by category with search
const getServicesByCategory = async (req, res) => {
  try {
    console.log("Received request for services:", {
      query: req.query,
      headers: req.headers,
      url: req.originalUrl,
      method: req.method,
      path: req.path,
      body: req.body,
    });

    const { category, search } = req.query;

    // Log the received parameters
    console.log("Search parameters:", {
      category: category || "none",
      search: search || "none",
    });

    // First, let's check if we have any services at all
    const totalServices = await Service.count();
    console.log("Total services in database:", totalServices);

    // Log all services for debugging
    const allServices = await Service.findAll({ raw: true });
    console.log(
      "All services in database:",
      allServices.map((s) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        price: s.price,
      }))
    );

    // Build the where clause
    let whereClause = {};

    if (category) {
      // Make the category search case-insensitive
      whereClause.category = { [Op.iLike]: category };
      console.log("Searching for category:", category);
    }

    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ],
      };
      console.log("Searching for term:", search);
    }

    console.log("Final where clause:", JSON.stringify(whereClause, null, 2));

    // Get the services
    const services = await Service.findAll({
      where: whereClause,
      order: [["total_orders", "DESC"]],
      raw: true, // Get plain objects instead of Sequelize instances
    });

    console.log(`Found ${services.length} services matching criteria`);
    if (services.length > 0) {
      console.log("First service:", {
        id: services[0].id,
        name: services[0].name,
        category: services[0].category,
        price: services[0].price,
        image: services[0].image,
      });
    }

    if (services.length === 0) {
      // Log all unique categories in the database to help debug
      const allCategories = await Service.findAll({
        attributes: [
          [sequelize.fn("DISTINCT", sequelize.col("category")), "category"],
        ],
        raw: true,
      });
      console.log(
        "Available categories in database:",
        allCategories.map((c) => c.category)
      );
    }

    // Transform the services
    const updatedServices = services.map((service) => ({
      ...service,
      image: service.image
        ? `${req.protocol}://${req.get("host")}/${service.image.replace(
            /^\/+/,
            ""
          )}`
        : null,
      price: parseFloat(service.price || 0),
      total_orders: parseInt(service.total_orders || 0),
      total_providers: parseInt(service.total_providers || 0),
    }));

    // Get total completed orders
    const totalCompletedOrders = await Order.count({
      where: { status: "completed" },
    });

    console.log("Sending response:", {
      servicesCount: updatedServices.length,
      totalCompletedOrders,
      firstService: updatedServices[0]
        ? {
            id: updatedServices[0].id,
            name: updatedServices[0].name,
            category: updatedServices[0].category,
          }
        : null,
    });

    // Send the response
    res.status(200).json({
      success: true,
      services: updatedServices,
      totalCompletedOrders,
      metadata: {
        totalServices,
        matchingServices: services.length,
        category: category || "all",
      },
    });
  } catch (error) {
    console.error("Error in getServicesByCategory:", {
      message: error.message,
      stack: error.stack,
      query: req.query,
    });

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Update service statistics
const updateServiceStats = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findByPk(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Update total orders
    const totalOrders = await Order.count({
      include: [
        {
          model: Service,
          where: { id: serviceId },
        },
      ],
    });

    await service.update({
      total_orders: totalOrders,
    });

    res.status(200).json({
      success: true,
      message: "Service statistics updated successfully",
      service,
    });
  } catch (error) {
    console.error("Error updating service stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createService,
  getServicesByCategory,
  updateServiceStats,
};
