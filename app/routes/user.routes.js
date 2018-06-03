const user = require('../controllers/note.controller');

module.exports = (app) => {
  // Create a new Note
  app.post('/users', user.create);

  // Retrieve all Notes
  app.get('/users', user.findAll);

  // Retrieve a single Note with noteId
  app.get('/users/:userId', user.findOne);

  // Update a Note with noteId
  app.put('/users/:userId', user.update);

  // Delete a Note with noteId
  app.delete('/users/:userId', user.delete);
};