const express = require("express");
const router = express.Router();
const {
  getServicesByCategory,
  createService,
  updateServiceStats,
} = require("../controllers/service");
const { authenticate } = require("../middlewares/authenticate");

// 📌 Use multer middleware to handle file uploads
router.get("/", getServicesByCategory);

// Create new service (protected route)
router.post("/", authenticate, createService);

// Update service statistics
router.put("/:serviceId/stats", authenticate, updateServiceStats);

module.exports = router;
