const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
//Post model
const Post = require("../../Models/Post");
const Profile = require("../../Models/Profile");

//Validation
const validatePostInput = require("../../validation/post");

// @route  GET api/posts/test
// @desc   Tests post route
// @access Public
router.get("/test", (req, res) => {
  //res.json() is similar to res.send() but it's going to output Json
  // And this is what we want from this Api is to server JSON
  // This will automatically serve a status of 200
  // 200: Everything is okay
  res.json({
    msg: "Post works"
  });
});

// @route  POST api/posts
// @desc   Create post
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    /**What will happen in the app is that when the user is logged in this data will be stored in the state
     * the user won't actually have to insert his name, avatar each time
     * we will just retrieve them from state
     */

    // Check Validation
    if (!isValid) {
      // DON'T FORGET OTHERWISE THE REST OF THE CODE WILL ALSO GET EXECUTED
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => {
      res.json(post);
    });
  }
);

// @route  GET api/posts
// @desc   Fetch post
// @access Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      console.log(posts);
      res.json(posts);
    })
    .catch(err => {
      res.status(404).json({
        err,
        nopostsfound: "No posts found"
      });
    });
});

// @route  GET api/posts/:id
// @desc   Fetch  by id
// @access Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that id" })
    );
});

// @route  DELETE api/posts/:id
// @desc   Delete post by id
// @access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //Check for post owner
          if (post.user.toString() !== req.user.id) {
            // You want to protect yourself in the backend and not just the front otherwise anyone can open Postman and delete the stuff
            // Just make sure that the user deleting this post is the owner of the post
            return res
              .status(401)
              .json({ notauthorized: "User not authorizd" });
          }
          //Delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json("Post not found"));
    });
  }
);

// @route  POST api/posts/like/:id
// @desc   Delete post by id
// @access Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //TODO: I think it is unnecessary to fetch the profile since we already have the user id in the token
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //We need to check if the user has already like the post
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User has already liked this post" });
          }
          // Add user id to the likes array
          post.likes.unshift({ user: req.user.id });
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json("Post not found"));
    });
  }
);

// @route  POST api/posts/unlike/:id
// @desc   Unlike post by id
// @access Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //We need to check if the user has already like the post
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not yet liked this post" });
          }
          // Get the remove index
          const removeIndex = post.likes
            .map(item => {
              item.user.toString();
            })
            .indexOf(req.user.id);

          // Splice out of array
          post.likes.splice(removeIndex, 1);

          // Save
          post.save().then(post => {
            res.json(post);
          });
        })
        .catch(err => res.status(404).json("Post not found"));
    });
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add to comments array
        post.comments.unshift(newComment);

        // Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check to see if comment exists
        // TODO: Must understand .filter method
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;

module.exports = router;
