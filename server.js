const express = require("express");
const mongoose = require("mongoose");
const app = express();

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch(err => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Hello");
});

//process.env.Port is for Heroku
const port = process.env.Port || 5000;
// `` ES6 Template literal is used so that we can put a variable inside the String
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
