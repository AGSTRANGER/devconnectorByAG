const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const ProfileSchema = new Schema({
  //We want to associate the user with the profile
  user: {
    //This will associate the user by his id
    type: Schema.Types.ObjectId,
    ref: "users"
    //TODO: How does this automatically populate the user with the userId?I.e; How does it know the associated user?
    /**
     * {
    "skills": [
        "HTML",
        "CSS",
        "JAVASCRIPT",
        "PHP"
    ],
    "_id": "5e36d4c14c12d61271e3727f",
    "user": "5e326f3f313eb52fa6673acf",
    "handle": "Ahmed Ghrib",
    "status": "Developer",
    "experience": [],
    "education": [],
    "__v": 0
}
     */
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
  },
  location: {
    type: String
  },
  status: {
    //where they are in their career
    type: String,
    required: true
  },
  skills: {
    // In the form they will put skill1,skill2,.. and we will turn that into an array
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  experience: [
    {
      title: { type: String, required: true },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
        // Not required, going to be a checkbox
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  education: [
    {
      school: { type: String, required: true },
      degree: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
        // Not required, going to be a checkbox
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },

  date: {
    type: Date,
    dafault: Date.now
  }
});

module.exports = Profile = mongoose.model("profiles", ProfileSchema);
