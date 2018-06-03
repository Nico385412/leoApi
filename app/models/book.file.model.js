const mongoose = require('mongoose');

const BookFileSchema = mongoose.Schema({
  book: { data: Buffer, contentType: String },
}, {
  timestamps: true,
});

module.exports = mongoose.model('BookFile', BookFileSchema);
