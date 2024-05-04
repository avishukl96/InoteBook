const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  let obj = {
    name: "Physics",
    title: "SSE",
  };
  res.json(obj);
});

module.exports = router;
