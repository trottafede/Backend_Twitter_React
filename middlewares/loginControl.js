const logedIn = async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/signIn");
  }
};

module.exports = logedIn;
