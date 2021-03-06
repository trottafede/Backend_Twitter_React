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
  let image =
    "https://pm1.narvii.com/6796/e227b6ba84cdc3772b24da658fe3561471ea6a91v2_hq.jpg";
  let bio =
    "Nuevo usuario, por favor modifca tu perfil y que te diviertas :). HA bootcamp, 2021";
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
          image: image,
          bio: bio,
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

const userTweets = async (req, res) => {
  const tweets = await Tweet.find({ author: req.user.userId })
    .populate("author")
    .limit(20)
    .sort({ createdAt: "desc" });

  res.json(tweets);

  // const usersToFollow = await User.find().sort({ createdAt: "asc" });
};

const getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.json(user);
};

const patchUser = async (req, res) => {
  console.log(req.body);

  await User.findByIdAndUpdate(
    req.params.id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      image: req.body.image,
      bio: req.body.bio,
    },
    { useFindAndModify: false },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated User : ", docs);
      }
    }
  );

  res.status(200).json("patcheado con éxito");
};

const getUserInfo = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  res.json(user);
};

const getUserTweets = async (req, res) => {
  const tweets = await Tweet.find({ author: req.params.id })
    .populate("author")
    .limit(20)
    .sort({ createdAt: "desc" });
  res.json(tweets);
};

const getUsers = async (req, res) => {
  const usersToFollow = await User.find().limit(20).sort({ createdAt: "desc" });

  res.json(usersToFollow);
};

module.exports = {
  sendToken,
  sendTweets,
  newTweet,
  createLike,
  newUser,
  userTweets,
  getUser,
  patchUser,
  getUserInfo,
  getUserTweets,
  getUsers,
};
