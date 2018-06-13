const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../.env.js');

// CREATES A NEW USER
exports.create = (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(401).send('missing parametters');
    return;
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 8);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  user.save()
    .then((val) => {
      const token = jwt.sign({ id: val.id }, config.secret, {
        expiresIn: 86400, // expires in 24 hours
      });
      res.status(200).send({ auth: true, token });
    })
    .catch(err => res.status(500).send(err));
};

// RETURNS ALL THE USERS IN THE DATABASE

exports.findAll = (req, res) => {
  User.find()
    .then(val => res.status(200).send(val))
    .catch(err => res.status(500).send(err));
};

// GETS A SINGLE USER FROM THE DATABASE

exports.findOne = (req, res) => {
  User.findById(req.params.id, { password: 0 })
    .then(val => res.status(200).send(val))
    .catch(err => res.status(500).send(err));
};

// DELETES A USER FROM THE DATABASE

exports.delete = (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(val => res.status(200).send(val))
    .catch(err => res.status(500).send(err));
};


// UPDATES A SINGLE USER IN THE DATABASE

exports.update = (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(val => res.status(200).send(val))
    .catch(err => res.status(500).send(err));
};

// GET A USER PAYLOAD
exports.me = (req, res) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).send({ auth: false, message: 'no token provided.' });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token' });
    }
    User.findById(decoded.id, { password: 0 })
      .then(val => res.status(200).send(val))
      .catch(errId => res.status(500).send(errId));
  });
  return null;
};

// LOGIN
exports.login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(401).send('missing parametters');
    return;
  }
  User.findOne({ email: req.body.email })
    .then((user) => {
      const validPassword = bcrypt.compareSync(req.body.password, user.password);
      if (!validPassword) {
        return res.status(401).send({ auth: false, token: null });
      }
      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // Expire in 24 hours
      });
      res.status(200).send({ auth: true, token });
    });
};

// LOGOUT
exports.logout = (req, res) => {
  res.status(200).send({ auth: false, token: null });
};
