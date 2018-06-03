const multer = require('multer'); // file storing middleware

// MULTER CONFIG: to get file photos to temp server storage
const multerConfig = {
  storage: multer.diskStorage({
    // Setup where the user's file will go
    destination: (req, file, next) => {
      next(null, './tmp/book-storage');
    },

    // Then give the file a unique name
    filename: (req, file, next) => {
      console.log(file);
      // const ext = file.mimetype.split('/')[1].split('+')[0];
      next(null, `${file.originalname}`);
    },
  }),
  // A means of ensuring only images are uploaded.
  fileFilter: (req, file, next) => {
    if (!file) {
      next();
    }
    const book = file.mimetype.startsWith('application/epub');
    if (book) {
      console.log('book uploaded');
      next(null, true);
    } else {
      console.log('file not supported');

      // TODO:  A better message response to user on failure.
      return next();
    }
  },
};

module.exports = multerConfig;
