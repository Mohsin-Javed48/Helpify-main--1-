const { User, Role, Service } = require("../models");
const { generateHash } = require("../helper/hash");

// Function to add a Service Provider
const registerProvider = async (req, res) => {
  try {
    const { firstName, lastName, email, password, address, contact } = req.body;

    // Check if the role "Provider" exists
    const providerRole = await Role.findOne({ where: { name: "Provider" } });

    if (!providerRole) {
      return res.status(400).json({ message: "Provider role not found!" });
    }

    // Check if the email is already in use
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered!" });
    }

    // Hash the password before storing it
    const hashedPassword = await generateHash(password);

    // Create a new service provider user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      address,
      contact,
      roleId: providerRole.id, // Assign Provider role
    });

    // Response without exposing password
    res.status(201).json({
      message: "Service Provider added successfully!",
      provider: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        address: newUser.address,
        contact: newUser.contact,
        role: providerRole.name, // Show role name instead of ID
      },
    });
  } catch (error) {
    console.error("Error adding Service Provider:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addService = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const providerId = req.user.id; // Assuming the user ID is stored in req.user after authentication

    const service = await Service.create({
      name,
      description,
      price,
      providerId,
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { registerProvider, addService };
