//function isEmpty(value) {
/**
   * const isEmpty = value => {
  return (
    // TODO: Must understand the difference between === and ==
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    // TODO: What does trim do?
    (typeof value === "string" && value.trim().length === 0)
  );
};

   * Refactoring the function only to the necessary code
   */
const isEmpty = value =>
  // TODO: Must understand the difference between === and ==
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  // TODO: What does trim do?
  (typeof value === "string" && value.trim().length === 0);

module.exports = isEmpty;
