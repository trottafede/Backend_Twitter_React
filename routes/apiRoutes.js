const express = require("express");
const router = express.Router();

const apiController = require("../controllers/apiController");

router.post("/tokens", apiController.sendToken);
router.post("/user", apiController.newUser);

// Private Routes
router.get("/tweets", apiController.sendTweets);
router.get("/userTweets", apiController.userTweets);

router.get("/userInfo", apiController.getUser);

router.post("/create", apiController.newTweet);

router.post("/like", apiController.createLike);

module.exports = router;
