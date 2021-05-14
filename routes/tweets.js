const express = require("express");
const router = express.Router();
const tweetController = require("../controllers/tweetController");
const logedIn = require("../middlewares/loginControl");

// router.post("/create", logedIn, tweetController.newTweet);
router.post("/create", tweetController.newTweet);
router.post("/like", logedIn, tweetController.createLike);

module.exports = router;
