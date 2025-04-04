const express = require("express");
const { sequelize } = require("./models");
const router = require("./routes/index");
const cors = require("cors");
const logger = require("morgan");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));

// Static file serving
const publicPath = path.join(__dirname, "../public");
app.use("/public", express.static(publicPath));

// API Routes
app.use("/api/v1", router); // Use only /api/v1 for consistency

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database connection with retry mechanism
const connectToDatabase = async (retries = 5, delay = 5000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Database connection attempt ${attempt}/${retries}...`);
      await sequelize.authenticate();
      console.log("Database connected successfully!");
      return true;
    } catch (err) {
      console.error(
        `Database connection attempt ${attempt} failed:`,
        err.message
      );

      if (attempt === retries) {
        console.error(
          "Maximum connection attempts reached. Could not connect to database."
        );
        return false;
      }

      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return false;
};

// Initialize database connection
connectToDatabase()
  .then((connected) => {
    if (!connected) {
      console.warn(
        "Application running without database connection. Some features may not work."
      );
    }
  })
  .catch((err) => {
    console.error("Error in database connection process:", err);
  });

// Add a health check route that also tests database connectivity
app.get("/health", async (req, res) => {
  try {
    // Test database connection
    await sequelize.query("SELECT 1+1 AS result");

    res.status(200).json({
      status: "healthy",
      server: "running",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "unhealthy",
      server: "running",
      database: "disconnected",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

app.use((error, _req, res, _next) => {
  const statusCode = error.status || 500;
  const message = error.message || "Something went wrong";

  console.error(error); // Log the error details for debugging

  // Send the error response
  res.status(statusCode).json({
    message: message,
  });
});

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  // Add ping timeout and interval
  pingTimeout: 60000,
  pingInterval: 25000,
  path: "/socket.io/",
});

// Socket.IO connections
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Join provider room
  socket.on("join_provider_room", (providerId) => {
    if (!providerId) {
      console.error("Missing providerId in join_provider_room event");
      return;
    }

    const roomName = `provider_${providerId}`;
    socket.join(roomName);
    console.log(`Provider ${providerId} joined room ${roomName}`);

    // Acknowledge the join
    socket.emit("room_joined", { room: roomName, status: "success" });

    // Send a test message to verify the socket is working
    setTimeout(() => {
      socket.emit("connection_test", {
        message: "Socket connection is working properly",
      });
    }, 2000);
  });

  // Join customer room
  socket.on("join_customer_room", (customerId) => {
    if (!customerId) {
      console.error("Missing customerId in join_customer_room event");
      return;
    }

    const roomName = `customer_${customerId}`;
    socket.join(roomName);
    console.log(`Customer ${customerId} joined room ${roomName}`);

    // Acknowledge the join
    socket.emit("room_joined", { room: roomName, status: "success" });
  });

  // Reject order by provider
  socket.on("reject_order", async ({ orderId, providerId }) => {
    if (!orderId) {
      console.error("Missing orderId in reject_order event");
      return;
    }

    if (!providerId) {
      console.error("Missing providerId in reject_order event");
      return;
    }

    console.log(`Provider ${providerId} rejected order ${orderId} via socket`);

    try {
      // Update the database to reflect the rejection
      const { Order } = require("./models");
      const order = await Order.findByPk(orderId);

      if (!order) {
        console.error(`Order ${orderId} not found for rejection`);
        return;
      }

      // Track the rejection - implementation depends on your data model
      console.log(`Order status before rejection: ${order.status}`);

      // Only update if this provider was assigned to the order
      if (order.serviceProviderId === providerId) {
        await order.update({
          status: "provider_rejected",
          serviceProviderId: null,
        });
        console.log(`Updated order ${orderId} status to provider_rejected`);
      }

      // Notify the customer that their order was rejected
      if (order.userId) {
        io.to(`customer_${order.userId}`).emit("order_rejected", {
          orderId,
          providerId,
        });
        console.log(`Notified customer ${order.userId} about rejection`);
      }
    } catch (error) {
      console.error(`Error processing order rejection:`, error);
    }
  });

  // Handle error events
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  // Handle disconnection
  socket.on("disconnect", (reason) => {
    console.log("Client disconnected:", socket.id, "Reason:", reason);
  });
});

// Error handling for Socket.IO server
io.engine.on("connection_error", (err) => {
  console.error(
    "Socket.IO connection error:",
    err.req,
    err.code,
    err.message,
    err.context
  );
});

// Expose io for use elsewhere in the app
app.set("io", io);

// Add a basic test route to check if server is working
app.get("/test", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

server
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log("Port is busy, trying to close previous connection...");
      require("child_process").exec(`npx kill-port ${PORT}`, (err) => {
        if (!err) {
          console.log(`Port ${PORT} was freed`);
          server.listen(PORT);
        }
      });
    }
  });

module.exports = app;
