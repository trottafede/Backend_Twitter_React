const express = require("express");
const router = express.Router();

const apiController = require("../controllers/apiController");

router.post("/tokens", apiController.sendToken);
router.post("/user", apiController.newUser);

// Private Routes
router.get("/tweets", apiController.sendTweets);
router.get("/userTweets", apiController.userTweets);

router.patch("/user/:id", apiController.patchUser);

router.get("/userInfo", apiController.getUser);
router.get("/usersInfo", apiController.getUsers);

router.get("/userInfo/:id", apiController.getUserInfo);
router.get("/userTweets/:id", apiController.getUserTweets);

router.post("/create", apiController.newTweet);

router.post("/like", apiController.createLike);

module.exports = router;
