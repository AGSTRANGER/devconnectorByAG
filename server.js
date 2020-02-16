const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const passport = require("passport");

const path = require("path");
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

// Server static assets if in production
// Check if we are in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));
  // We want to get anything that is not one of those api routes
  app.get("*", (req, res) => {
    // __dirname is the current directory name
    //We will tell the server if none of those routes are being hit then look into the build folder index.html
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
//process.env.Port is for Heroku
const port = process.env.PORT || 5000;
// `` ES6 Template literal is used so that we can put a variable inside the String
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
