const express = require("express");
const router = express.Router();

const apiController = require("../controllers/apiController");

router.post("/tokens", apiController.sendToken);

router.get("/tweets", apiController.sendTweets);

module.exports = router;
