const mongoose = require('mongoose');

const ImageFileSchema = mongoose.Schema({
  image: { data: Buffer, contentType: String },
});

module.exports = mongoose.model('ImageFile', ImageFileSchema);
