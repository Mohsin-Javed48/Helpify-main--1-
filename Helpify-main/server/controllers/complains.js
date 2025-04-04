const { Complains } = require("../models");

// Create a new complaint
const createComplain = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, subject, message, userId } = req.body;

    const complain = await Complains.create({
      userId,
      fullName,
      email,
      phoneNumber,
      subject,
      message,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complain,
    });
  } catch (error) {
    console.error("Error creating complaint:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit complaint",
      error: error.message,
    });
  }
};

// Get all complaints (admin only)
const getComplains = async (req, res) => {
  try {
    const complains = await Complains.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      complains,
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaints",
      error: error.message,
    });
  }
};

// Update complaint status
const updateComplainStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const complain = await Complains.findByPk(id);
    if (!complain) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    await complain.update({ status });

    return res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      complain,
    });
  } catch (error) {
    console.error("Error updating complaint status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update complaint status",
      error: error.message,
    });
  }
};

// Delete complaint
const deleteComplain = async (req, res) => {
  try {
    const { id } = req.params;
    const complain = await Complains.findByPk(id);

    if (!complain) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    await complain.destroy();

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting complaint",
      error: error.message,
    });
  }
};

module.exports = {
  createComplain,
  getComplains,
  updateComplainStatus,
  deleteComplain,
};
