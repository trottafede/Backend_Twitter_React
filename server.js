const path = require("path");
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// const seeder = require("./seeder");
// seeder();

//Conectando a base de datos
mongoose
  .connect(process.env.CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => console.log("Conectados a la base de datos"))
  .catch((err) => console.log(err));

//Importo rutas
const apiRoutes = require("./routes/apiRoutes");

//Settings
app.set("port", process.env.PORT || 4500);

//Middlewares
app.use(express.urlencoded({ extended: true })); // Para recibir formdata

var tokenAuth = require("express-jwt");
app.use(
  tokenAuth({
    secret: process.env.ACCESS_TOKEN_SECRET,
    algorithms: ["HS256"],
  }).unless({
    path: ["/tokens", "/user"],
  })
);

app.use(apiRoutes);

//Inicio Server
app.listen(app.get("port"), () => {
  console.log(`Server running in http://localhost:${app.get("port")}`);
});
