const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
//Load User model
const User = require("../../Models/User");

const passport = require("passport");

//Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

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

// @route  GET api/users/login
// @desc   Login User / Returning the JWT Token
// @access Public
router.post("/login", (req, res) => {
  // Before we do anything, we will validate the data
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  // Find User by email
  //User.findOne({email:email}), we can do this instead since it has the same name
  User.findOne({ email }).then(user => {
    /**
     * It will give us user if there's a match
     * If it doesn't match then this user variable will be false
     * So we'll do a check for user
     */
    if (!user) {
      errors.email = "User email not found!";
      return res.status(404).json(errors);
    }
    /**Check password */
    bcrypt.compare(password, user.password).then(
      //This will give us a true of false value
      isMatch => {
        if (isMatch) {
          /** If the user matched, this is where we want to generate the token */
          //res.json({ msg: "Login Succesful" });
          //Sign Token
          /**First we need to create a jwt payload, you can put whatever userinformation here except for the pwd of course */
          const payload = { id: user.id, name: user.name, avatar: user.avatar };
          /** sign will take a payload,
           * A payload is what we want to include in that token
           * Because when that token is sent back to the server
           * It needs to be decoded and the server knows which user it is,
           * We also need to send a secret or key,
           * and an expiration
           */
          jwt.sign(
            payload,
            keys.SecretKey,
            { expiresIn: 3600 },
            (error, token) => {
              res.json({
                success: true,
                /**The way we format the tokens in the header is by using Bearer
                 * It's a protocol
                 */
                token: "Bearer " + token
              });
            }
          );
        } else {
          /**Validation error: For example, non-valid email */
          errors.password = "Password incorrect";
          return res.status(400).json(errors);
        }
      }
    );
  });
});
// @route  GET api/users/current
// @desc   Return current user
// @access Private
// Session : false because we are not using session
router.get(
  "/current",
  //PS: Notice how the Authorization header hasn't been explicitly passed to the code inside passport.js
  // What does session false mean
  passport.authenticate("jwt", { session: false }),
  // TODO: Why is the user passed in req?
  (req, res) => {
    res.json("The current user is " + req.user.name);
  }
);
// @route  POST api/users/register
// @desc   Register user
// @access Public
router.post("/register", (req, res) => {
  // Before we do anything, we will validate the data
  const { errors, isValid } = validateRegisterInput(req.body);
  console.log({ errors, isValid });
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // First, we will use mongoose to find if the email exists
  // Because we don't want someone to register with an email that's already in the db
  // req.body.email is possible thanks to bodyParser module
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "email already exists";
      return res.status(400).json({
        errors
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
