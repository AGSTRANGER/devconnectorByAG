const Validator = require("validator");
const isEmpty = require("./isEmpty");
// data will be an object of stuff to validate
module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  //password2 is the password confirmation
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (
    !Validator.isLength(data.name, {
      min: 2,
      max: 30
    })
  ) {
    errors.name = "Name must be between 2 and 30 characters";
  }
  // The problem is that when a request is sent without a name
  // It's not going to be an empty string and Validator.isEmpty will not work so we do this
  // data.name=!isEmpty(data.name) ? data.name : '';
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (
    !Validator.isLength(data.password, {
      min: 6,
      max: 30
    })
  ) {
    errors.password = "Password must be at least 6 characters";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

  // isValid will depend on whether the object errors is empty or not
  // Validator already has a method but it applies only to strings
  // So will use a global method called empty that we can use on Anything
  // We could use isEmpty from lodash but we should minimize the libraries used in the project
  return { errors, isValid: isEmpty(errors) };
};
