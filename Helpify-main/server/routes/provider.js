const router = require("express").Router();

const {
  registerProvider,
  getAllProviders,
  getProviderById,
  getProviderByUserId,
  updateProvider,
  updateAvailability,
  addService,
  getProviderStats,
  getProviderRecentActivity,
} = require("../controllers/provider");
const { authenticate } = require("../middlewares/authenticate");
const { serviceProviderOnly } = require("../middlewares/serviceProviderOnly");

// Public routes
router.get("/", getAllProviders);

// User-specific provider route
router.get("/user/:userId", getProviderByUserId);

// Dashboard stats and activity
router.get("/stats/:id?", authenticate, serviceProviderOnly, getProviderStats);
router.get(
  "/recent-activity/:id?",
  authenticate,
  serviceProviderOnly,
  getProviderRecentActivity
);

// Provider registration - temporarily remove authentication requirement for testing
router.post("/register", registerProvider);

// ID-based routes
router.get("/:id", getProviderById);
router.put("/:id", authenticate, updateProvider);
router.patch("/:id/availability", authenticate, updateAvailability);
router.post("/:id/services", authenticate, addService);

module.exports = router;
