const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const passport = require("passport");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const Cors = require("cors");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Now we should be able to access request.body.whatever
// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch(err => {
    console.log(err);
  });

// Passport middleware
app.use(passport.initialize());

// Passport Config
// TODO: Understand the following syntax
// In passport.js: module.exports = passport => {};
// TODO: Why are we writing the following line here and note in users.js
require("./config/passport")(passport);

// Use Cors
// #RR: This line should be before the other routing lines
app.use(Cors());

// Use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

//process.env.Port is for Heroku
const port = process.env.Port || 5000;
// `` ES6 Template literal is used so that we can put a variable inside the String
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
