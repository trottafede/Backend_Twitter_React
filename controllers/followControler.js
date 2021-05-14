const Tweet = require("../models/Tweet");
const User = require("../models/User");

const addFollower = async (req, res) => {
  try {
    const followingUser = await User.findById(req.user._id);
    const followingResult = await followingUser.following.push({
      _id: req.params.id,
    });
    await followingUser.save();
    const followerUser = await User.findById(req.params.id);
    console.log(followerUser + "este es followerUser encontrado");
    const followerResult = await followerUser.followers.push({
      _id: req.user.id,
    });
    await followerUser.save();
  } catch (e) {
    console.log(e.message);
  } finally {
    res.redirect("/user");
  }
};

const removeFollower = async (req, res) => {
  try {
    const usuario = await User.findById(req.user._id);
    const guarde = await usuario.following.pull({ _id: req.params.id });
    await usuario.save();
    const followerUser = await User.findById(req.params.id);
    console.log(followerUser + "este es followerUser encontrado");
    const followerResult = await followerUser.followers.pull({
      _id: req.user.id,
    });
    await followerUser.save();
  } catch (e) {
    console.log(e.message);
  } finally {
    res.redirect("/user");
  }
};

const showFollow = async (req, res) => {
 // console.log("Logeado como: " + req.user);
 const user = req.user;
  
 const following = await User.find({ followers: req.user._id })
   .populate("user")
   .limit(20)
   .sort({ createdAt: "desc" });

   const followers = await User.find({ following: req.user._id })
   .populate("user")
   .limit(20)
   .sort({ createdAt: "desc" });
 // console.log(tweets);
 res.render("userFollow", { user, following, followers });
};
 /* 
    const user = req.user;
  
    const following = await User.find()
      .populate("user")
      .limit(20)
      .sort({ createdAt: "desc" });
  
      let arrayDeTweet = [];
  
    let count = 0;
  
    await new Promise((resolve) => {
      tweets.forEach(async (item) => {
        try {
          //some real logic
          let newUser = await User.findById(item.author);
  
          arrayDeTweet.push({
              firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            image: newUser.image,
            tweet: item.text,
            tweetDate: item.createdAt,
          });
        } catch (e) {
          // error handling
         // console.log(e);
        } finally {
          // most important is here
          count += 1;
          if (count == tweets.length) {
            // console.log(arrayDeTweet);
            resolve();
            res.render("home", { arrayDeTweet, user });
          }
        }
      });
    }); */

module.exports = {
  addFollower,
  removeFollower,
  showFollow,
};
