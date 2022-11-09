const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// initialize the storage disk engine - config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // We call it null because there is no error - where we want to upload
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    // extname - extension name
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  // test the expression against the extension that's passed in - true or false
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

// We are gonna pass this as a middleware to our route
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", upload.single("image"), (req, res) => {
  res.send(`/${req.file.path}`);
});

module.exports = router;
