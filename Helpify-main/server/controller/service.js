const { Service, User } = require("../models");

// Get all services
const getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll();

    res.status(200).json({ success: true, services });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { getAllServices };
