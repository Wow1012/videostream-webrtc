const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/default');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  check('firstname', 'First Name is required').notEmpty(),
  check('lastname', 'Last Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password','Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('phonenumber', 'PhoneNumber is required').notEmpty(),
  check('biography', 'Please enter a Biology with 100 or more characters').isLength({ min: 100 }),
  
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    const { firstname, lastname, email, password, phonenumber, biography } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      
      user = new User({
        firstname,
        lastname,
        email,
        password,
        phonenumber,
        biography
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
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
