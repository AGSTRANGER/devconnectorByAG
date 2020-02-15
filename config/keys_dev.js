// We don't want this file to be pushed so we'll add it to .gitIgnore
module.exports = {
  mongoURI:
    "mongodb+srv://Ahmed:TMOW5F6iq9Mgtbp5@cluster0-shqnc.mongodb.net/test?retryWrites=true&w=majority",
  //For JWT
  // TODO: What's the role of SecretKey?
  SecretKey: "secret"
};
