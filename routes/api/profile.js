const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Profile Model
const Profile = require("../../Models/Profile");
// Load Users Model
const User = require("../../Models/User");

const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// @route  GET api/profile/test
// @desc   Tests profile route
// @access Public
router.get("/test", (req, res) => {
  //res.json() is similar to res.send() but it's going to output Json
  // And this is what we want from this Api is to server JSON
  // This will automatically serve a status of 200
  // 200: Everything is okay
  res.json({
    msg: "Profile works"
  });
});

// @route  GET api/profile
// @desc   Get profile
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    //#RR: User after logging in, received token which has its info in it, and when he tries to access
    // a protected route, he sends his request with the token
    // Passport validates that it's him, and then responds with the 'decoded token info' in the request body
    // thus you can access it here with req.user.id
    Profile.findOne({ user: req.user.id })
      /** Since we connected the Profile collection with the users collection, we are able to populate the user information into the response */
      .populate("user", ["name", "avatar"])
      // #RR: User schema is associated with Profile schema
      // Usually findOne is done like this: User.findOne({ email: req.body.email }).then(user => {
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          //The app will ask the user then to create a profile with a button that will take him to a form
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route  GET api/profile/all
// @desc   Get all profiles
// @access Public
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json();
      }
      res.json(profiles);
    })
    .catch(err =>
      res.status(404).json({ profile: "There are no profiles yet" })
    );
});

/**
 * This is a backend api that'll be hit by the frontend. That's why we put :handle
 * The user won't actuallly have to write the word handle
 */

/**
 * This is a public route because anyone will be able to see profiles whether they're logged in or not signedup or not but of course you can change that
 */
// @route  GET api/profile/handle/:handle
// @desc   Get profile by handle
// @access Public
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile by user_id
// @access Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile for this user" })
    );
  //.catch(err => res.status(404).json(err)); the err causes response problems
});

// @route  POST api/profile
// @desc   Create or Edit user profile
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Before we do anything, we will validate the data
    const { errors, isValid } = validateProfileInput(req.body);
    // Check validation
    if (!isValid) {
      console.log("errors ; ", errors, " isValid : ", isValid);
      return res.status(400).json(errors);
    }
    // GET fields
    console.log("req.body: ", req.body);
    // #RR: After the login token is passed by the user to passport, passport extracts the userId from the token and retrieves the user data from the database and then returns it inside of request;
    console.log("req.user: ", req.user);
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // Skills - We need to split into array since it will be coming into coma separated values
    // TODO: Why undefined? Why not '' or null
    if (typeof req.body.skills != "undefined") {
      //This will give us an array of skills
      profileFields.skills = req.body.skills.split(",");
    }
    // Social
    // We must initialize profileFields.social otherwise we will get an error
    // if we try to populate it since it doesn't exist.
    profileFields.social = {};
    // TODO: How come I can validate with body.youtube? Do a console log.
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        /**https://mongoosejs.com/docs/tutorials/findoneandupdate.html
         * The findOneAndUpdate() function in Mongoose has a wide variety of use cases. You should use save() to update documents where possible, but there are some cases where you need to use findOneAndUpdate()
         *
         * As the name implies, findOneAndUpdate() finds the first document that matches a given filter,
         * applies an update, and returns the document.
         * By default, findOneAndUpdate() returns the document as it was before update was applied.
         *
         * You should set the new option to true to return the document after update was applied.
         */
        Profile.findOneAndUpdate(
          { user: req.user.id },
          /**
           * 
           * Update operators are operators that enable you to modify the data in your database or add
           * additional data.
           * https://docs.mongodb.com/manual/reference/operator/update/set/
           * { $set: { <field1>: <value1>, ... } }
           * 
           * Behavior 
           * If the field does not exist, $set will add a new field with the specified value, provided that
           * the new field does not violate a type constraint. If you specify a dotted path for a non-existent
           * field, $set will create the embedded documents as needed to fulfill the dotted path to the field.
           * To specify a <field> in an embedded document or in an array, use dot notation.
           * 
           * If you specify multiple field-value pairs, $set will update or create each field.
           * 
           * The $set operator replaces the value of a field with the specified value.
           * EXAMPLE:
           * 
           * {
                  _id: 100,
                  sku: "abc123",
                  quantity: 250,
                  instock: true,
                  reorder: false,
                  details: { model: "14Q2", make: "xyz" },
                  tags: [ "apparel", "clothing" ],
                  ratings: [ { by: "ijk", rating: 4 } ]
                }

           * db.products.update(
                  { _id: 100 },
                  { $set:
                      {
                        quantity: 500,
                        details: { model: "14Q3", make: "xyz" },
                        tags: [ "coats", "outerwear", "clothing" ]
                      }
                  }
                )
           * The operation replaces the value of: quantity to 500; the details field to a new embedded
           document, and the tags field to a new array.
           TODO: Understand mongodb atomicity and its link with update
           * Note: for backwards compatibility, all top-level update keys that are not $atomic operation names
           * are treated as $set operations. Example:
              var query = { name: 'bourne' };
              Model.update(query, { name: 'jason bourne' }, options, callback)

              // is sent as

              Model.update(query, { $set: { name: 'jason bourne' }}, options, callback)
           */
          { $set: profileFields },
          // You should set the new option to true to return the document after update was applied.
          { new: true }
        ).then(profile => {
          res.json(profile);
        });
      } else {
        // Create
        // Check if handle exists because we don't want multiple handles
        // #RR: The handle is used to access the profile in an SEO friendly way
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
            // TODO : How come a profile doesn't exist and the associated handle exists?
          }

          // Save Profile
          new Profile(profileFields)
            .save()
            .then(saved_profile => res.json(saved_profile));
        });
      }
    });
  }
);

// @route  POST api/profile/experience
// @desc   Add experience to profile
// @access Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Before we do anything, we will validate the data
    const { errors, isValid } = validateExperienceInput(req.body);
    // Check validation
    if (!isValid) {
      console.log("errors ; ", errors, " isValid : ", isValid);
      return res.status(400).json(errors);
    }
    //#RR: req.user_id comes from the token
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      //Add to exp array
      // Unshift will add it in beginning instead of using push which will add it in the end
      profile.experience.unshift(newExp);

      profile.save().then(profile => {
        res.json(profile);
      });
    });
  }
);

// @route  POST api/profile/education
// @desc   Add education to profile
// @access Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Before we do anything, we will validate the data
    const { errors, isValid } = validateEducationInput(req.body);
    // Check validation
    if (!isValid) {
      console.log("errors ; ", errors, " isValid : ", isValid);
      return res.status(400).json(errors);
    }
    //#RR: req.user_id comes from the token
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      //Add to exp array
      // Unshift will add it in beginning instead of using push which will add it in the end
      profile.education.unshift(newEdu);

      profile.save().then(profile => {
        res.json(profile);
      });
    });
  }
);

// @route  DELETE api/profile/experience/:exp_id
// @desc   Delete experience from profile
// @access Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //#RR: req.user_id comes from the token
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        // This will get us the index of the experience to delete
        const removeIndex = profile.experience
          // This should return an array of the ids of the experiences
          .map(item => item.id)
          // This should return the INDEX of the experience id. I.e: its rank
          .indexOf(req.params.exp_id);

        //Splice out of array
        profile.experience.splice(removeIndex, 1);

        //Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route  DELETE api/profile/experience/:exp_id
// @desc   Delete experience from profile
// @access Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //#RR: req.user_id comes from the token
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        // This will get us the index of the experience to delete
        const removeIndex = profile.education
          // This should return an array of the ids of the experiences
          .map(item => item.id)
          // This should return the INDEX of the experience id. I.e: its rank
          .indexOf(req.params.exp_id);

        //Splice out of array
        profile.education.splice(removeIndex, 1);

        //Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route  DELETE api/profile
// @desc   Delete user and profile
// @access Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      //Since this is the user collection, the matching will be done based on the _id not the user
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json("User and profile deleted")
      );
    });
  }
);
module.exports = router;
