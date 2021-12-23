const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Setting = require("../../models/Setting");

router.get("/logo", async (req, res) => {
  const logo = await Setting.findOne({}, {}).select("logo");
  res.json(logo);
});

router.get("/menu", async (req, res) => {
  const gender = await Setting.findOne({}, {}).select("genders");
  res.json(gender);
});

router.get("/about", async (req, res) => {
  const about = await Setting.findOne({}, {}).select("about");
  res.json(about);
});

router.get("/contact", async (req, res) => {
  const contact = await Setting.findOne({}, {}).select("contact");
  res.json(contact);
});

module.exports = router;
