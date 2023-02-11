const router = require("express").Router();
const User = require("../model/User");

//register
router.get("/register", async (req, res) => {
  const user = await new User({
    username: "itachi",
    email: "itachi@gmail.com",
    password: "123456",
  });
  await user.save();
  res.send("ok");
});

module.exports = router;
