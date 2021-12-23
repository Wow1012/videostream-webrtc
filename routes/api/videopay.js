const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const VideoPay = require("../../models/VideoPay");

router.get("/:streamer/:watcher/:video", async (req, res) => {
  try {
    await VideoPay.countDocuments(
      {
        streamer: req.params.streamer,
        watcher: req.params.watcher,
        video: req.params.video,
      },
      async (err, count) => {
        if (count == 0) {
          let videopay = new VideoPay({
            streamer: req.params.streamer,
            watcher: req.params.watcher,
            video: req.params.video,
          });
          await videopay.save();

          res.json(paid);
        }

        let paid = await VideoPay.findOne(
          {
            streamer: req.params.streamer,
            watcher: req.params.watcher,
            video: req.params.video,
          },
          { new: true }
        ).select("paid");
        res.json(paid);
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
    await VideoPay.find(
      {
        streamer: req.body.streamer,
        watcher: req.body.watcher,
        video: req.body.video,
      },
      async (err, doc) => {
        if (doc.length != 0) {
          let paid = await VideoPay.findOneAndUpdate(
            {
              streamer: req.body.streamer,
              watcher: req.body.watcher,
              video: req.body.video,
            },
            { paid: 1 },
            { new: true }
          );
          res.json(paid);
        } else {
          let paid = new VideoPay({
            streamer: req.body.streamer,
            watcher: req.body.watcher,
            video: req.body.video,
            paid: 1,
          });
          await paid.save();
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
