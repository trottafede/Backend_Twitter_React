const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const followController = require("../controllers/followControler");
const passport = require("passport");
const logedIn = require("../middlewares/loginControl");

const homeController = require("../controllers/homeController");

const authController = require("../middlewares/authenticateToken");

// router.get("/", logedIn, userController.showHome);
// router.get("/", logedIn, homeController.userHome);
router.get("/", homeController.showHome);

router.get("/user", logedIn, homeController.userHome);

router.get("/signIn", userController.showSignIn);
router.post(
  "/signIn",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signIn",
  })
);

router.get("/signUp", authController, userController.showSignUp);
router.post("/signUp", userController.validateSignUp);

router.get("/editProfile", logedIn, userController.editProfile);
router.post("/editProfile", logedIn, userController.validateEditProfile);

router.get("/follow/:id", logedIn, followController.addFollower);
router.get("/stop-follow/:id", logedIn, followController.removeFollower);
router.get("/showFollow/:id", logedIn, followController.showFollow);

router.get("/logout", logedIn, homeController.logout);

module.exports = router;
