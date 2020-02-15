if (process.env.NODE_ENV === "production") {
  // If we're in Heroku it should load this
  module.exports = require("./keys_prod");
} else {
  // If we're still in local, it should load this
  module.exports = require("./keys_dev");
}
