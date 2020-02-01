const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const ProfileSchema = new Schema({
  //We want to associate the user with the profile
  user: {
    //This will associate the user by his id
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  // We want a user friendl url
  handle: {
    type: String,
    required: true, // Even though we are doing pre-validatioon
    max: 40
  },
  company: {
    type: String
  },
  website: {
    type: String
  }
});

module.exports = User = mongoose.model("profiles", UserSchema);
