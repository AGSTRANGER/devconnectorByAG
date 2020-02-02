const Validator = require("validator");
const isEmpty = require("./isEmpty");
// data will be an object of stuff to validate
module.exports = function validateProfileInput(data) {
  let errors = {};
  /**
   * Validator.isEmpty only works on strings
   * but if the user doesn't submit sthg in a form like the handler which is required
   * it's not going to come as an empty string it will come as null or undefined
   *
   * So if it comes as null or undefined, we need to make sure to convert it into an empty string
   * so that we can check it with isValid.isEmpty
   */
  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  /**
   * Validator.isEmpty only works on strings
   * but if the user doesn't submit sthg in a form like the handler which is required
   * it's not going to come as an empty string it will come as null or undefined
   *
   */
  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle needs to be between 2 and 40 characters";
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Profile handle is required";
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = "Status field is required";
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = "Skills field is required";
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "Not a valid URL";
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = "Not a valid URL";
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = "Not a valid URL";
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "Not a valid URL";
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = "Not a valid URL";
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = "Not a valid URL";
    }
  }

  return { errors, isValid: isEmpty(errors) };
};
