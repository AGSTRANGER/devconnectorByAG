const Validator = require("validator");
const isEmpty = require("./isEmpty");
// data will be an object of stuff to validate
module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // The problem is that when a request is sent without a name
  // It's not going to be an empty string and Validator.isEmpty will not work so we do this
  // data.name=!isEmpty(data.name) ? data.name : '';

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  // isValid will depend on whether the object errors is empty or not
  // Validator already has a method but it applies only to strings
  // So will use a global method called empty that we can use on Anything
  // We could use isEmpty from lodash but we should minimize the libraries used in the project
  return { errors, isValid: isEmpty(errors) };
};
