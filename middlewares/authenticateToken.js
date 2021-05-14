const { JsonWebTokenError } = require("jsonwebtoken");

function authToken(req, res, next) {
  var jwt = require("express-jwt");

  app.get(
    "/protected",
    jwt({ secret: "shhhhhhared-secret" }),
    function (req, res) {
      if (!req.user.admin) return res.sendStatus(401);
      res.sendStatus(200);
    }
  );
}

module.exports = authToken;
