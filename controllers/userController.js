const User = require("../models/User");

const showHome = async (req, res) => {
  // res.render("home", users);
};
const showSignIn = (req, res) => {
  // muestro mi página de registro
  res.render("signIn");
};

const validateSignIn = async (req, res) => {
  // muestro mi página de registro
  // validar datos de entrada
  // comparar con el backend
  // redirigir al home
  res.render("userHome");
};

const showSignUp = (req, res) => {
  // muestro mi página de registro

  res.render("signUp");
};

const validateSignUp = async (req, res) => {
  const bcrypt = require("bcryptjs");
  var validator = require("email-validator");
  const faker = require("faker");

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const userName = req.body.userName;
  const email = req.body.email;
  const image = faker.image.avatar();
  let bio = req.body.bio;
  let password = req.body.password;

  bio = "mi bio";
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
          password: hash,
          bio: bio,
        });

        newUser.save((error, savvedNewUser) => {
          if (error) return console.log(error);
          console.log("\n User salvado: \n" + savvedNewUser);
        });

        res.redirect("/");
      } else {
        console.log(
          "Hay algo que no es válido------------------------------------------------"
        );
      }
    });
  });
};

const editProfile = (req, res) => {
  // muestro mi página de registro
  // console.log(req.user._id);
  const user = req.user;
  res.render("editProfile", { user });
};

const validateEditProfile = async (req, res) => {
  const updateProfile = await User.findByIdAndUpdate(
    req.user._id,
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

  res.redirect("/");
};

module.exports = {
  showHome,
  showSignIn,
  validateSignIn,
  showSignUp,
  validateSignUp,
  editProfile,
  validateEditProfile,
};
