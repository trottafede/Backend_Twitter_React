const express = require("express");
const router = express.Router();

const apiController = require("../controllers/apiController");

router.post("/tokens", apiController.sendToken);
router.post("/user", apiController.newUser);

// Private Routes
router.get("/tweets", apiController.sendTweets);

router.post("/create", apiController.newTweet);

router.post("/like", apiController.createLike);

module.exports = router;
