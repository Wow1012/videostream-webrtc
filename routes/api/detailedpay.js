const express = require("express");
const router = express.Router();

const VideoPay = require("../../models/VideoPay");
const Upload = require("../../models/Upload");
const WatchingTime = require("../../models/WatchingTime");

router.get("/:streamer/:watcher", async (req, res) => {
  var fileList = [];

  let files = await Upload.find({ streamer: req.params.streamer }).exec();

  fileList = files;

  let temp = [];

  await fileList.forEach(async (file, index) => {
    try {
      let tempfile = {};
      tempfile = file;
      let doc = await VideoPay.find({
        streamer: req.params.streamer,
        watcher: req.params.watcher,
        video: file._id,
      }).exec();
      if (doc.length == 0) {
        let videopay = await new VideoPay({
          streamer: req.params.streamer,
          watcher: req.params.watcher,
          video: file._id,
        });
        await videopay.save();
        tempfile.paid = 0;
      } else {
        let paid = await VideoPay.findOne(
          {
            streamer: req.params.streamer,
            watcher: req.params.watcher,
            video: file._id,
          },
          { new: true }
        ).select("paid");

        tempfile.paid = paid.paid;

        temp.push(tempfile);

        if (index == fileList.length - 1) console.log(temp);
      }
    } catch {
      (e) => {
        console.error(e.message);
        res.status(500).send("Server error");
      };
    }
  });

  console.log("ASD0");
  console.log(temp);
  res.json(temp);
});

module.exports = router;
