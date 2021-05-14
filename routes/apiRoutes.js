const express = require("express");
const router = express.Router();

const apiController = require("../controllers/apiController");

router.post("/tokens", apiController.sendToken);

router.get("/tweets", apiController.sendTweets);

router.post("/create", apiController.newTweet);

router.post("/createLike", apiController.newTweet);

module.exports = router;
