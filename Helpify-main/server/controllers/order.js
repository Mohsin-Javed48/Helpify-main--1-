const {
  Order,
  OrderService,
  Service,
  RejectedOrder,
  User,
  ServiceProvider,
} = require("../models");
const { sequelize, Sequelize } = require("../models");
const { Op } = Sequelize;

// Create a new order with services
const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      userId,
      serviceProviderId,
      address,
      area,
      city,
      zipCode,
      additionalInfo,
      scheduledDate,
      scheduledTime,
      amount,
      services,
      status,
      paymentStatus,
    } = req.body;

    // Debug log to help identify the issue
    console.log(
      "Create order request body:",
      JSON.stringify(req.body, null, 2)
    );

    // Validate required fields with detailed feedback
    const missingFields = [];
    if (!userId) missingFields.push("userId");
    if (!address) missingFields.push("address");
    if (!scheduledDate) missingFields.push("scheduledDate");
    if (!scheduledTime) missingFields.push("scheduledTime");
    if (!services || services.length === 0) missingFields.push("services");

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return res.status(400).json({
        success: false,
        message: `Required fields missing: ${missingFields.join(", ")}`,
      });
    }

    // Create the order
    const newOrder = await Order.create(
      {
        userId,
        serviceProviderId: serviceProviderId || null,
        address,
        area,
        city,
        zipCode,
        additionalInfo,
        scheduledDate,
        scheduledTime,
        amount,
        status: status || "pending",
        paymentStatus: paymentStatus || "pending",
      },
      { transaction }
    );

    console.log("Order created successfully with ID:", newOrder.id);

    // Add services to the order
    const orderServicePromises = services.map(async (service) => {
      console.log(`Processing service:`, JSON.stringify(service, null, 2));

      if (!service.id) {
        console.error(`Service is missing id`);
        throw new Error(`Service is missing required id field`);
      }

      if (!service.price) {
        console.error(`Service is missing price`);
        throw new Error(`Service is missing required price field`);
      }

      // If we have a serviceId, try to get details from the Service model
      let serviceDetails = {};
      if (service.serviceId) {
        const serviceRecord = await Service.findByPk(service.serviceId);
        if (serviceRecord) {
          serviceDetails = {
            title: serviceRecord.name,
            subtitle: serviceRecord.description,
            image: serviceRecord.image,
            price: serviceRecord.price,
          };
        }
      }

      return OrderService.create(
        {
          orderId: newOrder.id,
          serviceId: service.serviceId || service.id,
          title: service.title || serviceDetails.title,
          subtitle: service.subtitle || serviceDetails.subtitle,
          image: service.image || serviceDetails.image,
          quantity: service.quantity || 1,
          price: service.price || serviceDetails.price,
          subtotal:
            (service.price || serviceDetails.price) * (service.quantity || 1),
          notes: service.notes || "",
        },
        { transaction }
      );
    });

    await Promise.all(orderServicePromises);
    console.log("All order services created successfully");

    // Commit transaction
    await transaction.commit();
    console.log("Transaction committed successfully");

    // Retrieve the complete order with services
    const completeOrder = await Order.findByPk(newOrder.id, {
      include: [
        {
          model: Service,
          as: "services",
          through: {
            attributes: [
              "quantity",
              "price",
              "subtotal",
              "title",
              "subtitle",
              "image",
            ],
          },
        },
      ],
    });

    // After creating an order successfully, find and notify relevant service providers
    await notifyServiceProviders(req, newOrder, services);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: completeOrder,
    });
  } catch (error) {
    // Rollback transaction in case of error
    await transaction.rollback();
    console.error("Error creating order:", error);
    console.error("Error stack:", error.stack);

    // More detailed error response
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
      errorDetails:
        process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Get all orders (with optional filters)
const getOrders = async (req, res) => {
  try {
    const { userId, serviceProviderId, status } = req.query;
    const whereClause = {};

    // Add filters if provided
    if (userId) whereClause.userId = userId;
    if (serviceProviderId) whereClause.serviceProviderId = serviceProviderId;
    if (status) whereClause.status = status;

    const orders = await Order.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "customer",
          attributes: ["id", "firstName", "lastName", "email", "contact"],
        },
        {
          model: Service,
          as: "services",
          through: {
            attributes: [
              "quantity",
              "price",
              "subtotal",
              "title",
              "subtitle",
              "image",
            ],
          },
        },
        {
          model: ServiceProvider,
          as: "serviceProvider",
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName", "email", "contact"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: order.customer,
        serviceProvider: order.serviceProvider,
        scheduledDate: order.scheduledDate,
        scheduledTime: order.scheduledTime,
        amount: order.amount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        address: order.address,
        area: order.area,
        city: order.city,
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: Service,
          as: "services",
          through: {
            attributes: [
              "quantity",
              "price",
              "subtotal",
              "title",
              "subtitle",
              "image",
            ],
          },
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// Update an order
const updateOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const {
      serviceProviderId,
      status,
      paymentStatus,
      rating,
      review,
      services,
      ...otherFields
    } = req.body;

    // Find the order
    const order = await Order.findByPk(id);

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // If status is changed to completed, set completedAt date
    if (status === "completed" && order.status !== "completed") {
      otherFields.completedAt = new Date();
    }

    // Update the order
    await order.update(
      {
        serviceProviderId,
        status,
        paymentStatus,
        rating,
        review,
        ...otherFields,
      },
      { transaction }
    );

    // If services are provided, update them
    if (services && services.length > 0) {
      // Delete existing order services
      await OrderService.destroy({
        where: { orderId: id },
        transaction,
      });

      // Add new services
      const orderServicePromises = services.map(async (service) => {
        return OrderService.create(
          {
            orderId: id,
            serviceId: service.id,
            title: service.name || service.title,
            subtitle: service.description || service.subtitle,
            image: service.image,
            quantity: service.quantity || 1,
            price: service.price,
            subtotal: service.price * (service.quantity || 1),
            notes: service.notes,
          },
          { transaction }
        );
      });

      await Promise.all(orderServicePromises);
    }

    // Commit transaction
    await transaction.commit();

    // Retrieve the updated order with services
    const updatedOrder = await Order.findByPk(id, {
      include: [
        {
          model: Service,
          as: "services",
          through: {
            attributes: [
              "quantity",
              "price",
              "subtotal",
              "title",
              "subtitle",
              "image",
            ],
          },
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    // Rollback transaction in case of error
    await transaction.rollback();
    console.error("Error updating order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    // Find the order
    const order = await Order.findByPk(id);

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Delete all order services first (They should be cascaded, but just to be safe)
    await OrderService.destroy({
      where: { orderId: id },
      transaction,
    });

    // Delete the order
    await order.destroy({ transaction });

    // Commit transaction
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    // Rollback transaction in case of error
    await transaction.rollback();
    console.error("Error deleting order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    });
  }
};

// Assign service provider to an order
const assignServiceProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceProviderId } = req.body;

    if (!serviceProviderId) {
      return res.status(400).json({
        success: false,
        message: "Service provider ID is required",
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

    // Update the order with the service provider
    await order.update({ serviceProviderId });

    return res.status(200).json({
      success: true,
      message: "Service provider assigned successfully",
      order,
    });
  } catch (error) {
    console.error("Error assigning service provider:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to assign service provider",
      error: error.message,
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
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

    // Update the order status
    await order.update({
      status,
      completedAt: status === "completed" ? new Date() : order.completedAt,
    });

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// Get orders by user ID
const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderService,
          as: "services",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching user orders",
      error: error.message,
    });
  }
};

// Get orders by service provider ID
const getOrdersByProviderId = async (req, res) => {
  try {
    const { providerId } = req.params;
    console.log("Fetching orders for provider:", providerId);

    // Get orders where provider is assigned or has an accepted bid
    const orders = await Order.findAll({
      where: {
        [Op.or]: [
          { serviceProviderId: providerId },
          {
            id: {
              [Op.in]: sequelize.literal(`(
                SELECT "orderId" FROM "OrderBids" 
                WHERE "serviceProviderId" = ${providerId} 
                AND status = 'accepted'
              )`),
            },
          },
        ],
      },
      include: [
        {
          model: Service,
          as: "services",
          through: {
            model: OrderService,
            attributes: [
              "quantity",
              "price",
              "subtotal",
              "title",
              "subtitle",
              "image",
            ],
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    console.log("Found orders:", orders.length);

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching provider orders:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching provider orders",
      error: error.message,
    });
  }
};

// Get orders by service provider ID and status
const getOrdersByProviderIdAndStatus = async (req, res) => {
  try {
    const { providerId, status } = req.params;

    // Validate input
    if (!providerId) {
      return res.status(400).json({
        success: false,
        message: "Provider ID is required",
      });
    }

    const statusFilter = status || "pending"; // Default to pending if not specified

    let rejectedOrderIds = [];
    try {
      // Get IDs of orders rejected by this provider
      rejectedOrderIds = await RejectedOrder.findAll({
        where: { serviceProviderId: providerId },
        attributes: ["orderId"],
        raw: true,
      }).then((rejections) => rejections.map((r) => r.orderId));

      console.log(
        `Provider ${providerId} has rejected orders:`,
        rejectedOrderIds
      );
    } catch (error) {
      console.warn(
        "Error fetching rejected orders (table might not exist yet):",
        error.message
      );
      // Continue without rejected orders if table doesn't exist
    }

    const whereClause = {
      status: statusFilter,
    };

    // Only add the notIn clause if we have rejected orders
    if (rejectedOrderIds.length > 0) {
      whereClause.id = { [Op.notIn]: rejectedOrderIds };
    }

    console.log(
      "Finding orders with where clause:",
      JSON.stringify(whereClause, null, 2)
    );

    // First get all orders
    const orders = await Order.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    // Then get all order services for these orders
    const orderIds = orders.map((order) => order.id);
    const orderServices = await OrderService.findAll({
      where: {
        orderId: { [Op.in]: orderIds },
      },
      attributes: ["orderId", "title", "subtitle", "price", "quantity"],
      raw: true,
    });

    // Group services by order ID
    const servicesByOrder = orderServices.reduce((acc, service) => {
      if (!acc[service.orderId]) {
        acc[service.orderId] = [];
      }
      acc[service.orderId].push({
        title: service.title,
        subtitle: service.subtitle,
        price: service.price,
        quantity: service.quantity,
      });
      return acc;
    }, {});

    // Combine orders with their services
    const ordersWithServices = orders.map((order) => ({
      ...order,
      services: servicesByOrder[order.id] || [],
    }));

    console.log(`Found ${orders.length} orders for provider ${providerId}`);
    if (ordersWithServices.length > 0) {
      console.log("First order services:", ordersWithServices[0].services);
    }

    return res.status(200).json({
      success: true,
      count: ordersWithServices.length,
      orders: ordersWithServices,
    });
  } catch (error) {
    console.error(
      `Error fetching ${req.params.status || "pending"} orders for provider ${
        req.params.providerId
      }:`,
      error
    );
    return res.status(500).json({
      success: false,
      message: `Failed to fetch orders for provider`,
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating payment status",
      error: error.message,
    });
  }
};

// After creating an order successfully, find and notify relevant service providers
const notifyServiceProviders = async (req, newOrder, services) => {
  try {
    // Get the service categories from the order
    const servicePromises = services.map(async (service) => {
      const serviceData = await Service.findByPk(service.serviceId);
      return serviceData ? serviceData.category : null;
    });

    const serviceCategories = (await Promise.all(servicePromises)).filter(
      (category) => category !== null
    );

    // Find service providers with matching designations
    const { ServiceProvider, User } = require("../models");
    const serviceProviders = await ServiceProvider.findAll({
      where: {
        designation: { [Op.in]: serviceCategories },
        availabilityStatus: "online", // Only notify available providers
        isVerified: true, // Only notify verified providers
      },
    });

    if (serviceProviders.length > 0) {
      // Get the io instance to emit socket events
      const io = req.app.get("io");

      // Prepare order data for notification
      const orderData = {
        id: newOrder.id,
        title: `New ${serviceCategories.join("/")} service request`,
        address: newOrder.address,
        scheduledDate: newOrder.scheduledDate,
        scheduledTime: newOrder.scheduledTime,
        amount: newOrder.amount,
        services: serviceCategories,
      };

      // Notify each matching service provider
      serviceProviders.forEach((provider) => {
        io.to(`provider_${provider.id}`).emit("new_order_request", orderData);
      });

      console.log(
        `Notified ${serviceProviders.length} service providers about new order ${newOrder.id}`
      );
    }
  } catch (error) {
    console.error("Error notifying service providers:", error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  assignServiceProvider,
  updateOrderStatus,
  getOrdersByUserId,
  getOrdersByProviderId,
  getOrdersByProviderIdAndStatus,
  updatePaymentStatus,
  notifyServiceProviders,
};
