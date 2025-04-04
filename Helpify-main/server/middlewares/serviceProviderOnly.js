const { ServiceProvider } = require("../models");

const serviceProviderOnly = async (req, res, next) => {
  try {
    const isServiceProvider = req.user.roleId == 2;

    if (!isServiceProvider) {
      return res.status(403).json({
        message:
          "Access denied. Only service providers can access this resource.",
      });
    }

    // Find provider details for the user
    const provider = await ServiceProvider.findOne({
      where: { userId: req.user.id },
    });

    if (!provider) {
      return res.status(404).json({
        message: "Service provider profile not found for this user.",
      });
    }

    // Add provider ID to the request
    req.providerId = provider.id;

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { serviceProviderOnly };
