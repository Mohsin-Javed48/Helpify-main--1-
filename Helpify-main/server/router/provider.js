const router = require("express").Router();

const { registerProvider, addService } = require("../controller/provider");
const { authenticate } = require("../middlewares/authenticate");
const { serviceProviderOnly } = require("../middlewares/serviceProviderOnly");

router.post("/register", registerProvider);
router.post("/add-service",authenticate,serviceProviderOnly, addService);

module.exports = router;
