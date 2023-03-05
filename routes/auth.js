const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");

//register
router.post("/register", async (req, res) => {
  try {
    //generate password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //create new user
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    //save new user
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    console.log("yes", req.body);
    const user = await User.findOne({
      email: req.body.email,
    });
    if (user === null) {
      res.status(404).json("user not found");
    } else {
      console.log(user);
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      !validPassword && res.status(404).json("wrong password");
      res.status(200).json(user);
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
