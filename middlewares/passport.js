const bcrypt = require("bcryptjs");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

module.exports = (app) => {
  app.use(
    session({
      secret: "AlgúnTextoSuperSecreto",
      resave: false,
      // Docs: "The default value is true, but using the default has been deprecated ".
      saveUninitialized: false,
      // Docs: "The default value is true, but using the default has been deprecated ".
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passReqToCallback: true,
        session: false,
      },
      async function (req, username, password, done) {
        try {
          // console.log("Datos ingresados: " + username + " " + password);
          const user = await User.findOne({ userName: username });
          if (!user) {
            console.log("Usuario incorrecto");
            return done(null, false, {
              message: "Usuario incorrecto",
            });
          }
          if (!bcrypt.compareSync(password, user.password)) {
            console.log("Contraseña incorrecta");
            return done(null, false, {
              message: "Usuario y/o contraseña incorrectos",
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id)
      .then((user) => {
        done(null, user);
      })
      .catch((error) => {
        done(error, user);
      });
  });
};
