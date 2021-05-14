const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Tweet = require("../models/Tweet");

const sendToken = async (req, res) => {
  let user = req.body.username;
  let password = req.body.password;

  let userDB;

  userDB = await User.findOne({ userName: user });

  if (!userDB) {
    res.status(404).json({
      error: "Usuario incorrecto",
    });
  }

  if (!(await bcrypt.compare(password, userDB.password))) {
    res.status(404).json({
      error: "Contraseña incorrecta",
    });
  }

  let token = jwt.sign(
    { userId: userDB._id, userName: userDB.userName, email: userDB.email },
    process.env.ACCESS_TOKEN_SECRET
  );

  res.json({
    userId: userDB._id,
    userName: userDB.userName,
    token,
  });
};

const sendTweets = async (req, res) => {
  const user = req.user;
  console.log(user);
  const arrayDeTweets = await Tweet.find()
    .sort({ createdAt: -1 })
    .populate("author")
    .limit(20);

  res.json({ arrayDeTweets, user });
};

const newTweet = async (req, res) => {
  // console.log("texto es: " + req.body.text + " de: ");
  // console.log(req.user);
  // const { text } = req.body;

  // const tweet = new Tweet({ text, author: req.body.user });
  // console.log(req.body);
  // await tweet.save(); //try y catch
  // res.json(tweet);

  const { text } = req.body;
  if (text.length > 2 && text.length < 141) {
    const tweet = await Tweet.create({ text, author: req.user.userId });
    await User.updateOne(
      { _id: req.user.userId },
      {
        $push: {
          tweets: { _id: tweet._id },
        },
      }
    );
    res.json({
      ok: true,
    });
  } else {
    res.status(400).json({
      error: "No se pudo crear el tweet. Intente nuevamente.",
    });
  }
};

const createLike = async (req, res) => {
  try {
    //conseguir el tweet que el usuario hace like
    let tweet = await Tweet.findById(req.body.tweetId);

    //al campo like [] agregarle id del usuario que hace click
    if (tweet.likes.includes(req.body.user)) {
      console.log("este usuario está dentro de los likes");
      const index = tweet.likes.indexOf(req.body.user);
      if (index > -1) {
        tweet.likes.splice(index, 1);
      }
    } else {
      console.log("este usuario no está dentro de los likes de este tweet");
      tweet.likes.push(req.body.user);
    }

    await tweet.save();
  } catch {
    return res.status(400).send({
      message: "This is an error!",
    });
  }

  return res.json("like successful");
};

module.exports = {
  sendToken,
  sendTweets,
  newTweet,
  createLike,
};
