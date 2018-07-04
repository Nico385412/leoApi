const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  bookLiked: [{ type: mongoose.Schema.ObjectId, ref: 'Book', default: [] }],
});

module.exports = mongoose.model('User', UserSchema);
