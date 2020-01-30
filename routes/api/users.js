const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

//Load User model
const User = require("../../Models/User");

// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get("/test", (req, res) => {
  console.log("Inside User test GET request");

  //res.json() is similar to res.send() but it's going to output Json
  // And this is what we want from this Api is to server JSON
  // This will automatically serve a status of 200
  // 200: Everything is okay
  res.json({
    msg: "Users works"
  });
});

// @route  GET api/users/register
// @desc   Register user
// @access Public
router.post("/register", (req, res) => {
  console.log("Inside User Regist Post request");
  //First, we will use mongoose to find if the email exists
  // Because we don't want someone to register with an email that's already in the db
  // req.body.email is possible thanks to bodyParser module
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({
        email: "Email already exists"
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //Size
        r: "pg", //Rating
        d: "mm" //Default
      });
      // new Modelname({data})
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        // This will be the avatar URL
        //avatar: avatar,
        // Since they are the same with ES6 we can do just avatar
        // But it doesn't know what avatar is, for this we will use gravatar
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        // If there's an error it'll give us an error, if not it'll give us a hash
        // A hash is what you want to store in the database
        bcrypt.hash(newUser.password, salt, (error, hash) => {
          if (error) {
            throw error;
          }
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => {
              console.log(err);
            });
        });
      });
    }
  });
});

module.exports = router;
