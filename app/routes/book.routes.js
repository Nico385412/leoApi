const books = require('../controllers/book.controller');
const multer = require('multer');
const multerConfig = require('../../config/multer.config');
const verifyToken = require('../auth/AuthController');

module.exports = (app) => {
  // Create a new Note
  app.post('/books', verifyToken, multer(multerConfig).single('book'), books.create);
  // Retrieve all Notes
  app.get('/books', verifyToken, books.findAll);

  // Retrieve a single Note with noteId
  app.get('/books/:bookId/file', verifyToken, books.findOnefile);

  // Retrieve a single Note with noteId
  app.get('/books/:bookId/image', verifyToken, books.findOneImage);

  // Retrieve a single Note with noteId
  app.get('/books/:bookId', verifyToken, books.findOne);

  // Update a Note with noteId
  app.put('/books/:bookId', verifyToken, books.update);

  // Delete a Note with noteId
  app.delete('/books/:bookId', verifyToken, books.delete);
};
