const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/Users");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = "avanishisagreatman";

//Create a user using : POST "api/auth/createuser/". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid Name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must be atleast 5 charectors").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }

    try {
      //Check whether user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        res.status(400).json({ error: "Sorry, Email id is already exists " });
      }
      // Generate a salt
      const salt = await bcrypt.genSalt(10);

      // Hash the password using the generated salt
      const secPass = await bcrypt.hash(req.body.password, salt);

      //create a new user
      let createuser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: createuser.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      //console.log(jwtData);

      res.json({ authtoken });
    } catch (error) {
      console.log("error:" + error);
      res.status(500).send("Some error occured");
    }
  }
);

module.exports = router;
