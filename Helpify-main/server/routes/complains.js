const express = require("express");
const router = express.Router();
const {
  createComplain,
  getComplains,
  updateComplainStatus,
  deleteComplain,
} = require("../controllers/complains");
const { authenticate } = require("../middleware/auth");
const { checkRole } = require("../middlewares/checkRole");

// Create a new complaint
router.post("/", createComplain);

// Get all complaints (admin only)
router.get("/", authenticate, checkRole([1]), getComplains);

// Update complaint status (admin only)
router.patch("/:id/status", authenticate, checkRole([1]), updateComplainStatus);

// Delete complaint (admin only)
router.delete("/:id", authenticate, checkRole([1]), deleteComplain);

module.exports = router;
