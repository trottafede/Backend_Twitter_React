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
  const arrayDeTweets = await Tweet.find()
    .sort({ createdAt: -1 })
    .populate("author")
    .limit(20);

  res.json({ arrayDeTweets, user });
};

const newTweet = async (req, res) => {
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
    if (tweet.likes.includes(req.user.userId)) {
      const index = tweet.likes.indexOf(req.user.userId);
      if (index > -1) {
        tweet.likes.splice(index, 1);
      }
    } else {
      tweet.likes.push(req.user.userId);
    }

    await tweet.save();
  } catch {
    return res.status(400).send({
      message: "This is an error!",
    });
  }

  return res.json("like successful");
};

const newUser = async (req, res) => {
  const bcrypt = require("bcryptjs");
  var validator = require("email-validator");

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const userName = req.body.username;
  const email = req.body.email;
  // const image = faker.image.avatar();
  // let bio = req.body.bio;
  let password = req.body.password;

  // bio = "mi bio";
  // Falta validar usuario no repetido

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        console.log("Error de algo" + err);
      }
      if (
        validator.validate(email) &&
        firstName.length >= 4 &&
        lastName.length >= 4 &&
        password.length >= 4 &&
        userName.length >= 4
      ) {
        console.log(
          "Todo válido y validado------------------------------------------------"
        );

        let newUser = new User({
          firstName: firstName,
          lastName: lastName,
          userName: userName,
          email: email,
          // image: image,
          // bio: bio,
          password: hash,
        });

        newUser.save((error, savvedNewUser) => {
          if (error) return console.log(error);
        });
        res.status(201).json("Se guardó");
      } else {
        res.status(406).json("No se pudo guardar");
      }
    });
  });
};

module.exports = {
  sendToken,
  sendTweets,
  newTweet,
  createLike,
  newUser,
};
