const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/");

router.post("/login", async (req, res) => {
   const user = await User.findOne({ name: req.body.name });
   if (!user) {
      return res.sendStatus(403);
   }
   try {
      const hashedPassword = user.password;
      const passwordMatched = await bcrypt.compare(req.body.password, hashedPassword);
      if (!passwordMatched) {
         return res.sendStatus(403);
      }
      const accessToken = jwt.sign({ name: user.name }, process.env.JWT_ACCESS_TOKEN);
      res.json({ name: user.name, accessToken: accessToken });
   } catch (error) {
      res.sendStatus(500);
   }
});

router.get("/isloggedin", (req, res) => {
   const accessToken = req.headers["authorization"].split(" ")[1];
   try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN);
      res.status(200).json(decoded);
   } catch (e) {
      res.sendStatus(403);
   }
});

module.exports = router;
