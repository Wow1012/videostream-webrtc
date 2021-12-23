const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const WatchingTime = require("../../models/WatchingTime");

router.get("/:streamer/:watcher", async (req, res) => {
  try {
    console.log(req.params.streamer);
    await WatchingTime.find(
      {
        streamer: req.params.streamer,
        watcher: req.params.watcher,
      },
      async (err, doc) => {
        if (doc.length == 0) {
          let watchtime = new WatchingTime({
            streamer: req.params.streamer,
            watcher: req.params.watcher,
          });
          await watchtime.save();
        }

        let time = await WatchingTime.findOne(
          {
            streamer: req.params.streamer,
            watcher: req.params.watcher,
          },
          { new: true }
        ).select("time");
        res.json(time);
      }
    );
  } catch {
    (e) => {
      console.error(e.message);
      res.status(500).send("Server error");
    };
  }
});

router.post("/", async (req, res) => {
  try {
    await WatchingTime.find(
      {
        streamer: req.body.streamer,
        watcher: req.body.watcher,
      },
      async (err, doc) => {
        if (doc.length != 0) {
          let time = await WatchingTime.findOneAndUpdate(
            {
              streamer: req.body.streamer,
              watcher: req.body.watcher,
            },
            { time: req.body.time },
            { new: true }
          );
          res.json(time);
        } else {
          let watchtime = new WatchingTime({
            streamer: req.body.streamer,
            watcher: req.body.watcher,
          });
          await watchtime.save();
          res.json("success");
        }
      }
    );
  } catch {
    (e) => {
      console.error(e.message);
      res.status(500).send("Server error");
    };
  }
});

module.exports = router;
