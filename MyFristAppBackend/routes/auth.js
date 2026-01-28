const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// SIGN UP
router.post("/signup", async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    console.log("SignUp")
    console.log(name,phone,password)

    // PHONE VALIDATION
    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // HASH PASSWORD
    const hashedPass = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      password: hashedPass,
    });

    res.json({ message: "User created successfully" });

  } catch (err) {
    res.status(400).json({ message: "User already exists", error: err });
  }
});

// SIGN IN
router.post("/signin", async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });
  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Incorrect password" });

  const token = jwt.sign({ id: user._id }, "mysecret");

  res.json({ message: "Login successful", token, user });
  console.log("SignIn")
  console.log(phone,password)
});

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  const { phone, newPassword } = req.body;

  const user = await User.findOne({ phone });

  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const hashedPass = await bcrypt.hash(newPassword, 10);

  user.password = hashedPass;
  await user.save();

  res.json({ message: "Password updated successfully" });
  console.log("Newpassword")
  console.log(phone,newPassword)
});

module.exports = router;
