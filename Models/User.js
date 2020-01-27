const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  // When the user enters email and registers we will have some logic that will hit the avatar server
  // And if there's an Avatar they will put that image into this field
  // If not it will put basically a placeholder image
  // We can keep required as true because either way it will have the associated avatar or a place holder
  avatar: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: Date.now
  }
});

module.exports = User = Mongoose.model("users", UserSchema);
