const Tweet = require("../models/Tweet");
const User = require("../models/User");

const newTweet = async (req, res) => {
  // console.log("texto es: " + req.body.text + " de: " + req.user);
  const { text } = req.body;

  const tweet = new Tweet({ text, author: req.body.user });
  console.log(req.body);
  await tweet.save(); //try y catch
  res.json(tweet);
};

const createLike = async (req, res) => {
  //conseguir el tweet que el usuario hace like
  let tweet = await Tweet.findById(req.body.tweetId);

  //al campo like [] agregarle id del usuario que hace click
  if (tweet.likes.includes(req.user._id)) {
    console.log("este usuario está dentro de los likes");
    const index = tweet.likes.indexOf(req.user._id);
    if (index > -1) {
      tweet.likes.splice(index, 1);
    }
  } else {
    console.log("este usuario no está dentro de los likes de este tweet");
    tweet.likes.push(req.user);
  }

  await tweet.save();
  res.redirect("/");
};

module.exports = {
  newTweet,
  createLike,
};

/* 
    const { text } = req.body;
    if (text.length > 2 && text.length < 141) {
      const tweet = await Tweet.create({ text, user: req.user });
      res.redirect("/");
    } else {
      res.redirect("/?Sucedio_un_error!!");
    }
  },

  destroy: async function (req, res) {
    try {
      const { id } = req.params;
      await Tweet.remove({ _id: id });
      res.redirect("/");
    } catch (err) {
      res.redirect("/?Sucedio_un_error!!");
    }
  },

  follow: async function (req, res) {
    const { id } = req.params;
    const userToFollow = await User.findById(id);
    console.log(userToFollow);
    for (let i = 0; i < userToFollow.followers.length; i++) {
      if (userToFollow.followers[i].equals(req.user._id)) {
        console.log("Ya estas siguiendo a este usuario");
        await User.updateOne(
          { _id: id },
          {
            $pull: {
              followers: { _id: req.user._id },
            },
          }
        );
      } else {
        await User.updateOne(
          { _id: id },
          { $push: { followers: req.user._id } }
        );
        await User.updateOne(
          { _id: req.user._id },
          { $push: { following: id } }
        );
      }
    }

    res.redirect("back");
  },
};
 */
