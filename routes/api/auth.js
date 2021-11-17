const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('../../config/default');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Streamer = require('../../models/Streamer');

// @route    GET api/auth/user
// @desc     Get user by token
// @access   Private
router.get('/user', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// @route    GET api/auth/streamer
// @desc     Get streamer by token
// @access   Private
router.get('/streamer', auth, async (req, res) => {
    try {
      const streamer = await Streamer.findById(req.streamer.id).select('-password');
      res.json(streamer);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});
  
// @route    POST api/auth/user
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/user/',
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

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

// @route    POST api/auth/streamer
// @desc     Authenticate streamer & get token
// @access   Public
router.post(
    '/streamer/',
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
  
      try {
        let streamer = await Streamer.findOne({ email });
  
        if (!streamer) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
  
        const isMatch = await bcrypt.compare(password, streamer.password);
  
        if (!isMatch) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
  
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
