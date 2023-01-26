require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true }));

// ----------------------- Database config -----------------------

require("./config/database");

// ----------------------- Sessions config -----------------------

const configSession = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  store: new MongoStore({ mongoUrl: process.env.MONGO_URI }),
};
app.use(session(configSession));

// ----------------------- Passport config -----------------------

const initializePassport = require("./config/passport");
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// --------------------------    Route      ----------------------------

app.use("/api/auth", require("./routes/RouteAuth"));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
