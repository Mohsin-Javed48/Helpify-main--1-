const { getAllServices } = require("../controller/service");

const router = require("express").Router();

router.get("/", getAllServices);

module.exports = router;
