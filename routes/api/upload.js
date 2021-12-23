const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const Upload = require("../../models/Upload");
const { check, validationResult } = require("express-validator");

////////////////////////////////////////////////////////////////////////////
////////////////////////////IMAGE UPLOAD///////////////////////////////////
////////////////////////////////////////////////////////////////////////////

const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: "images",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1 * 1000 * 1000, // 1 * 1000 * 1000 Bytes = 1MB
  },
});

// @route    POST api/upload
// @desc     Upload Single Image
// @access   Public
router.post(
  "/",
  imageUpload.single("image"),
  function (req, res) {
    res.send(req.file.filename);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;

// @route    POST api/upload/uploadBulkImage
// @desc     Upload Multiple Image
// @access   Public
router.post(
  "/uploadBulkImage",
  imageUpload.array("images", 5),
  (req, res) => {
    res.send(req.files);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

////////////////////////////////////////////////////////////////////////////
////////////////////////////VIDEO UPLOAD///////////////////////////////////
////////////////////////////////////////////////////////////////////////////

const videoStorage = multer.diskStorage({
  destination: "videos", // Destination to store video
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 10000000, // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
    // upload only mp4 and mkv format
    if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
      return cb(new Error("Please upload a video"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/uploadVideo",
  videoUpload.single("video"),
  (req, res) => {
    res.send(req.file);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

////////////////////////////////////////////////////////////////////////////
////////////////////////////LOGO UPLOAD///////////////////////////////////
////////////////////////////////////////////////////////////////////////////

const logoStorage = multer.diskStorage({
  // Destination to store image
  destination: "logo",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const logoUpload = multer({
  storage: logoStorage,
  limits: {
    fileSize: 1 * 1000 * 1000, // 1 * 1000 * 1000 Bytes = 1MB
  },
});

// @route    POST api/upload
// @desc     Upload Single Image
// @access   Public
router.post(
  "/logo",
  logoUpload.single("logo"),
  function (req, res) {
    res.send(req.file.filename);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

////////////////////////////////////////////////////////////////////////////
////////////////////////////FILE UPLOAD///////////////////////////////////
////////////////////////////////////////////////////////////////////////////

const fileStorage = multer.diskStorage({
  // Destination to store image
  destination: "upload",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const fileUpload = multer({
  storage: fileStorage,
  limits: {
    fileSize: 1 * 1000 * 1000 * 1000 * 100, // 1 * 1000 * 1000 * 1000 * 100 Bytes = 100GB
  },
});

// @route    POST api/upload/file/:streamer_id
// @desc     Upload Single Image
// @access   Public
router.post(
  "/file",
  fileUpload.single("file"),
  function (req, res) {
    res.json(req.file.filename);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.post(
  "/fileadd/:streamer_id",
  check("name", "Name is required").notEmpty(),
  check("price", "Price is required").notEmpty(),
  check("title", "Title is required").notEmpty(),
  check("description", "Description is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, price, title, description } = req.body;

    let fileadd = new Upload({
      streamer: req.params.streamer_id,
      name,
      price,
      title,
      description,
    });

    await fileadd.save();

    res.json("success");
  }
);

router.get("/fileadd/:streamer_id", async (req, res) => {
  let files = await Upload.find({ streamer: req.params.streamer_id }).exec();
  console.log(files);

  res.json(files);
});

module.exports = router;
