const mongoose = require('mongoose');

const BookFileTempLinkSchema = mongoose.Schema({
  bookId: String,
  cryptedId: String,
  dateMaxtoDowload: Date,
  permanent: Boolean,
});

module.exports = mongoose.model('BookFileTempLink', BookFileTempLinkSchema);
