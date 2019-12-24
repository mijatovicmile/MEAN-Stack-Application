const path = require("path");

// Multer package allows us to extract incoming files
const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

// Define where multer should put files, which it detects in the incoming request
const storage = multer.diskStorage({
  // Destination is a function which will be executed whenever multer tries to save a file
  destination: (req, file, callback) => {
    // Throw and return an error of if detect that file don't have one of these MIME types
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid MIME Type");

    if (isValid) {
      error = null;
    }
    callback(error, path.join(__dirname, "../images"));
  },
  // Filename
  filename: (req, file, callback) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const extension = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + "-" + Date.now() + "." + extension);
  }
});

module.exports = multer({ storage: storage }).single("image");
