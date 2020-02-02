const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
// This comes from User.js module.exports = User = mongoose.model("users", UserSchema);
const User = mongoose.model("users");
// #RR: We're sending that key with the request so we need to validate that
const keys = require("../config/keys");

const opts = {};
//PS: Notice how the Authorization header hasn't been explicitly passed to the code inside passport.js
// TODO: Must understand the Bearer thing
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.SecretKey;
// #RR:require("./config/passport")(passport);

module.exports = passport => {
  // jwt_payload will give us the user info that we included in routes/users.js when the user logged-in
  /**
   *  const payload = { id: user.id, name: user.name, avatar: user.avatar };
          /** sign will take a payload,
           * A payload is what we want to include in that token
           * Because when that token is sent back to the server
           * It needs to be decoded and the server knows which user it is,
           * We also need to send a secret or key,
           * and an expiration
           
          jwt.sign(
            payload,
   */
  // const payload = { id: user.id, name: user.name, avatar: user.avatar };
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      console.log(jwt_payload);
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            //error = null
            return done(null, user);
          }
          //false as the second parameter because there's no user
          return done(null, false);
        })
        .catch(err => {
          console.log(err);
        });
    })
  );
};
