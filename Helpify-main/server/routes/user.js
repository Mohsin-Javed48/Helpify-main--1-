const express = require("express");
const router = express.Router();
const {
  getAllCustomers,
  toggleUserStatus,
} = require("../controllers/userController");
const { authenticate } = require("../middlewares/authenticate");
const { checkRole } = require("../middlewares/checkRole");

// Get all customers (users with roleId 3)
// Only accessible by admin (roleId 1)
router.get("/", authenticate, checkRole([1]), getAllCustomers);

// Toggle user status
// Only accessible by admin (roleId 1)
router.patch("/:id/status", authenticate, checkRole([1]), toggleUserStatus);

module.exports = router;
