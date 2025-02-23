const express = require('express');
const session = require("express-session");
const passport = require("./middleware/auth").passport;
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT || 8080;
const app = express();

app
  .use(express.json())
  .use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  })
  .use("/auth", require("./routes/authRoutes")) // New Auth Routes
  .use("/", require("./routes"));

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});