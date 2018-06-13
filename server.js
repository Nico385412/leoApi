const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

// Create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: '50mb' }));

// let's declare a public static folder,
// this is where our client side static files/output go
app.use('/', express.static(`${__dirname}/tmp`));


// Configuring the database
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url)

  .then(() => {
    console.log('Successfully connected to the database');
  })

  .catch((err) => {
    console.log(`Could not connect to the database. Exiting now... ${err}`);
    process.exit();
  });

// define a simple route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes.',
  });
});

// Require routes
require('./app/routes/book.routes.js')(app);
require('./app/routes/user.routes.js')(app);

process.env.ROOTDIRECTORY = __dirname;

// listen for requests
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
