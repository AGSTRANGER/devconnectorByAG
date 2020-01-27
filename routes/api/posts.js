const express = require("express");
const router = express.Router();

// @route  GET api/posts/test
// @desc   Tests post route
// @access Public
router.get("/test", (req, res) => {
  //res.json() is similar to res.send() but it's going to output Json
  // And this is what we want from this Api is to server JSON
  // This will automatically serve a status of 200
  // 200: Everything is okay
  res.json({
    msg: "Post works"
  });
});

module.exports = router;
