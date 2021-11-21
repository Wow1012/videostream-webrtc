const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/default');
const { check, validationResult } = require('express-validator');

const User = require('../../models/Streamer');
const Streamer = require('../../models/Streamer');

// @route    POST api/streamers
// @desc     Register streamer
// @access   Public
router.post(
  '/',
  check('firstname', 'First Name is required').notEmpty(),
  check('lastname', 'Last Name is required').notEmpty(),
  check('nickname', 'Nick Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('phonenumber', 'PhoneNumber is required').notEmpty(),
  //check('birthday', 'Please include a valid date').isDate(),
  check('country', 'Country is required').notEmpty(),
  check('gender', 'Gender is required').notEmpty(),
  check('biography', 'Please enter a Biology with 100 or more characters').isLength({ min: 100 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);
    const { firstname, lastname, nickname, email, password, profileimage, phonenumber, birthday, country, address, zipcode, gender, biography} = req.body;

    try {
      let streamer = await Streamer.findOne({ email });

      if (streamer) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Streamer already exists' }] });
      }
      
      streamer = new Streamer({
        firstname,
        lastname,
        nickname,
        email,
        password,
        profileimage,
        phonenumber,
        birthday,
        country, 
        address, 
        zipcode, 
        gender, 
        biography
      });

      const salt = await bcrypt.genSalt(10);

      streamer.password = await bcrypt.hash(password, salt);

      await streamer.save();

      const payload = {
        streamer: {
          id: streamer.id
        }
      };

      jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
