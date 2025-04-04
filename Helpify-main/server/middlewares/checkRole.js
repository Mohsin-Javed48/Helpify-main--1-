const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // User data should be attached to req by authenticateToken middleware
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!allowedRoles.includes(req.user.roleId)) {
        return res.status(403).json({ message: "Access forbidden" });
      }

      next();
    } catch (error) {
      console.error("Error in role check:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

module.exports = { checkRole };
