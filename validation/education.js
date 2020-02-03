const Validator = require("validator");
const isEmpty = require("./isEmpty");
// data will be an object of stuff to validate
module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  // The problem is that when a request is sent without a name
  // It's not going to be an empty string and Validator.isEmpty will not work so we do this
  // data.name=!isEmpty(data.name) ? data.name : '';

  if (Validator.isEmpty(data.school)) {
    errors.school = "School field is required";
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = "Degree field is required";
  }

  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "Fieldofstudy field is required";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "From field is required";
  }

  // isValid will depend on whether the object errors is empty or not
  // Validator already has a method but it applies only to strings
  // So will use a global method called empty that we can use on Anything
  // We could use isEmpty from lodash but we should minimize the libraries used in the project
  return { errors, isValid: isEmpty(errors) };
};
