const Validator = require("validator");
// data will be an object of stuff to validate
module.exports = function validateRegisterInput(data) {
  let errors = {};
  // isLength not automatically recognised
  if (
    !Validator.isLength(data.name, {
      min: 2,
      max: 30
    })
  ) {
    errors.name = "Name must be between 2 and 30 characters";
  }
  // isValid will depend on whether the object errors is empty or not
  // Validator already has a method but it applies only to strings
  // So will use a global method called empty that we can use on Anything
  // We could use isEmpty from lodash but we should minimize the libraries used in the project
  return { errors, isValid: errors };
};
