const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const PostSchema = new Schema({
  user: {
    //This will associate the user by his id
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  text: {
    type: String,
    required: true
  },
  /** We want the user name and avatar with the post
   * we could do like with the profile populate
   * because we want to do this separately
   * So that when the user deletes his account
   * the post remains untouched
   * because the post might be valuable
   *
   * TODO: Soo how does putting name and avatar here makes them separate exactly?
   *
   */
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  /**I want to link the user with the like
   * when they hit theb button their user_id will go into this array
   * if they dislike the post their user id will get removed from this array
   *
   */
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model("post", PostSchema);
