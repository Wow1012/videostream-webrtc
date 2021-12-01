const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Broadcaster = require('../../models/Broadcaster');

// @route    POST api/broadcasters
// @desc     Add broadcaster
// @access   Public
router.post(
    '/',
    check('streamer', 'Streamer Id is required').notEmpty(),
    check('name', 'Name is required').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { streamer, name, profileimage} = req.body;

        try {
        let broadcaster = await Broadcaster.findOne({ streamer });

        if (broadcaster) {
            return res
            .status(400)
            .json({ errors: [{ msg: 'Broadcaster already exists' }] });
        }
        
        broadcaster = new Broadcaster({
            streamer,
            name,
            profileimage,
        });

        await broadcaster.save();

        return res.json(broadcaster);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);


// @route    DELETE api/broadcasters
// @desc     Delete broadcaster
// @access   Public
router.delete( '/:id', async (req, res) => {
    try {
        console.log("streamer", req.params.id);
        Broadcaster.findOneAndRemove({ streamer: req.params.id }, function (err, docs) {
            if(err) console.log(err);
            else console.log("Removed User : ", docs);
        })
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route    Get api/broadcasters
// @desc     Get all broadcaster
// @access   Public
router.get( '/', async (req, res) => {
    try {
        const broadcasters = await Broadcaster.find().select('-id');
        res.json(broadcasters);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
