/** It's up to you if you want to use the same database for development and production or different database for each case
 * But here we don't want to push the dev database to heroku, it's just for our dev
 */
/**Here we will use environment variables to store the key */
module.exports = {
  // MONGO_URI is an arbitrary choice, it can be anything
  mongoUri: process.env.MONGO_URI,
  SecretKey: process.env.SECRET_OR_KEY
};
/** We can add those variables through the Heroku interface
 * If someone gets this file, it means nothing to them
 * We can push it to github
 * Only the server will be able to understand what the actual URI is
 */
