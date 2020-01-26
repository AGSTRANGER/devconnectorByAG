const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("fyck");
});
//process.env.Port is for Heroku
const port = process.env.Port || 5000;
// `` ES6 Template literal is used so that we can put a variable inside the String
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
