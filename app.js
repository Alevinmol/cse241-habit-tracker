const express = require("express");
const session = require("express-session");
const passport = require("./middleware/auth").passport;
const bodyParser = require("body-parser");
const mongodb = require("./db/connect");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const path = require("path");

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
  .use("/", require("./routes"))
  .use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      swaggerOptions: {
        oauth2RedirectUrl: "http://localhost:8080/api-docs/oauth2-redirect.html"
      },
      initOAuth: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        scopes: ["openid", "profile", "email"],
        flow: "authorizationCode",
        usePkceWithAuthorizationCodeGrant: true
      }
    })
  )
  .use("/habits", require("./routes/habits"))
  .use("/users", require("./routes/users"))
  //.use("/api-docs", express.static(path.join(__dirname, "node_modules/swagger-ui-dist")));


mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});
