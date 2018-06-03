const mongoose = require('mongoose');


const BookSchema = mongoose.Schema({
  title: String,
  creator: String,
  creatorFileAs: String,
  language: String,
  subject: String,
  date: String,
  description: String,
  publisher: String,
  contributors: String,
  type: String,
  format: String,
  indentifier: String,
  source: String,
  relation: String,
  coverage: String,
  rights: String,
  cover: [{ type: mongoose.Schema.ObjectId, ref: 'ImageFile' }],
  book: [{ type: mongoose.Schema.ObjectId, ref: 'BookFile' }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Book', BookSchema);
