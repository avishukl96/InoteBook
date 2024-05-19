const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const router = express.Router();
const JWT_SECRET = "avanishisagreatman";

//Route: 1 => Create a user using : POST "api/auth/createuser/". No login required
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

      const salt = await bcrypt.genSalt(10); // Generate a salt
      const secPass = await bcrypt.hash(req.body.password, salt); // Hash the password using the generated salt

      //create a new user
      let createuser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: { id: createuser.id },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken });
    } catch (error) {
      console.log("error:" + error);
      res.status(500).send("Some error occured");
    }
  }
);

//Route: 2 => Authenticate a user : POST "api/auth/login/". No login required

router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password can not be blank").exists(),
  ],
  async (req, res) => {
    //if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please tey to use correct credentials" });
      }
      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return res
          .status(400)
          .json({ error: "Please tey to use correct credentials" });
      }

      const data = {
        user: { id: user.id },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken });
    } catch (error) {
      console.log("error:" + error);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Route: 3 => get loggedin User Details : POST "api/auth/getuser/".  login required

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password"); // get user details except password
    res.send(user);
  } catch (error) {
    console.log("error:" + error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
