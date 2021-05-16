const express = require("express");
const router = express.Router();

const apiController = require("../controllers/apiController");

router.post("/tokens", apiController.sendToken);

router.get("/tweets", apiController.sendTweets);

router.post("/create", apiController.newTweet);

router.post("/createLike", apiController.newTweet);

router.post("/like", apiController.createLike);

router.post("/user", apiController.newUser);

module.exports = router;
