// Import routes
const authRoutes = require("./routes/auth");
const serviceRoutes = require("./routes/service");
const providerRoutes = require("./routes/provider");
const orderRoutes = require("./routes/order");
// ... other routes

// Mount routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/service", serviceRoutes);
app.use("/api/v1/provider", providerRoutes);
app.use("/api/v1/order", orderRoutes);
// ... other route mounting
