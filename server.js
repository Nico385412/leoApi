const dbConfig = require((process.env.DOCKER)? './config/database.config.prod.js':'./config/database.config.js'); // eslint-disable-line
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Create express app
const app = express();

// Create express router
const router = express.Router();

// prefix all Routes
app.use('/api', router);

// parse requests of content-type - application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// parse requests of content-type - application/json
router.use(bodyParser.json({ limit: '50mb' }));

// let's declare a public static folder,
// this is where our client side static files/output go
router.use('/', express.static(`${__dirname}/tmp`));


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
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes.',
  });
});

// Require routes
require('./app/routes/book.routes.js')(router);
require('./app/routes/user.routes.js')(router);

process.env.ROOTDIRECTORY = __dirname;

// listen for requests
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
