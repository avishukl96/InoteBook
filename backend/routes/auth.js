const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/Users");
const router = express.Router();

router.get(
  "/",
  [
    body("name", "Enter a valid Name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must be atleast 5 charectors").isLength({
      min: 5,
    }),
  ],
  (req, res) => {
    //Check validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }
    //Adding Database
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        res.json({
          error: "Email id is already in used, Please Enter unique Email ",
          message: err.message,
        });
      });
  }
);

module.exports = router;
