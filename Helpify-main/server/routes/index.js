const router = require("express").Router();
const authRouter = require("./auth");
const providerRouter = require("./provider");
const serviceRouter = require("./service");
const orderRouter = require("./order");
const orderBidRouter = require("./orderBid");
const userRouter = require("./user");
const home = require("../controllers/home");
const complainsRouter = require("./complains");

// API routes
router.use("/auth", authRouter);
router.use("/provider", providerRouter);
router.use("/service", serviceRouter);
router.use("/order", orderRouter);
router.use("/bids", orderBidRouter);
router.use("/users", userRouter);
router.use("/complains", complainsRouter);

// Home route
router.get("/", home.hello);

module.exports = router;
