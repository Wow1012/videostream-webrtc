const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

////////////////////////////////////////////////////////////////////////////
////////////////////////////IMAGE UPLOAD///////////////////////////////////
////////////////////////////////////////////////////////////////////////////

const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'images', 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() 
            + path.extname(file.originalname))
        // file.fieldname is name of the field (image)
        // path.extname get the uploaded file extension
    }
});

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1 * 1000 * 1000   // 1 * 1000 * 1000 Bytes = 1MB
    },
})

// @route    POST api/upload
// @desc     Upload Single Image
// @access   Public
router.post(
  '/', imageUpload.single('image'), function(req , res) {
      res.send(req.file.filename);
  }, (error, req, res, next) => {
      res.status(400).send({error: error.message})
  }
);

module.exports = router;

// @route    POST api/upload/uploadBulkImage
// @desc     Upload Multiple Image
// @access   Public
router.post('/uploadBulkImage', imageUpload.array('images', 5),     (req, res) => {
    res.send(req.files)
 }, (error, req, res, next) => {
     res.status(400).send({ error: error.message })
 })

 
////////////////////////////////////////////////////////////////////////////
////////////////////////////VIDEO UPLOAD///////////////////////////////////
////////////////////////////////////////////////////////////////////////////

 const videoStorage = multer.diskStorage({
    destination: 'videos', // Destination to store video 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() 
         + path.extname(file.originalname))
    }
});

const videoUpload = multer({
    storage: videoStorage,
    limits: {
    fileSize: 10000000 // 10000000 Bytes = 10 MB
    },
    fileFilter(req, file, cb) {
      // upload only mp4 and mkv format
      if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) { 
         return cb(new Error('Please upload a video'))
      }
      cb(undefined, true)
   }
})

router.post('/uploadVideo', videoUpload.single('video'), (req, res) => {
    res.send(req.file)
 }, (error, req, res, next) => {
     res.status(400).send({ error: error.message })
 })