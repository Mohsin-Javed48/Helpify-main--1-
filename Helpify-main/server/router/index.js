const router = require("express").Router();
const authRouter = require("./auth");
const providerRouter = require("./provider");
const serviceRouter = require("./service");
const home = require("../controller/home");

router.use("/auth", authRouter);
router.use("/provider", providerRouter);
router.use("/service", serviceRouter);

router.get("/ping", home);

module.exports = router;
