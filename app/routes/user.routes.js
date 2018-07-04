const user = require('../controllers/user.controller');
const verifyToken = require('../auth/AuthController');

module.exports = (app) => {
  // Create a new Note
  app.post('/users', verifyToken, user.create);

  // Retrieve all Notes
  app.get('/users', verifyToken, user.findAll);

  // Retrieve user itself
  app.get('/users/me', user.me);

  // Login user
  app.post('/login', user.login);

  // Logout user
  app.post('/logout', verifyToken, user.logout);

  // Retrieve a single Note with noteId
  app.get('/users/:userId', verifyToken, user.findOne);

  // Update a Note with noteId
  app.put('/users/:userId', verifyToken, user.update);

  // Delete a Note with noteId
  app.delete('/users/:userId', verifyToken, user.delete);

  // Like a book
  app.put('/users/:userId/like/:bookId', verifyToken, user.likeABook);

  // DisLike a book
  app.put('/users/:userId/dislike/:bookId', verifyToken, user.disLikeABook);
};
