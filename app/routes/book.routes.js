const notes = require('../controllers/book.controller');
const multer = require('multer');
const multerConfig = require('../../config/multer.config');

module.exports = (app) => {
  // Create a new Note
  app.post('/books', multer(multerConfig).single('book'), notes.create);
  // Retrieve all Notes
  app.get('/books', notes.findAll);

  // Retrieve a single Note with noteId
  app.get('/books/:bookId/file', notes.findOnefile);

  // Retrieve a single Note with noteId
  app.get('/books/:bookId/image', notes.findOneImage);

  // Retrieve a single Note with noteId
  app.get('/books/:bookId', notes.findOne);

  // Update a Note with noteId
  app.put('/books/:bookId', notes.update);

  // Delete a Note with noteId
  app.delete('/books/:bookId', notes.delete);
};
