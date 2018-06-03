const User = require('../models/user.model');

// CREATES A NEW USER


exports.create = (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  user.save()
    .then(val => res.status(200).send(val))
    .catch(err => res.status(500).send(err));
};

// RETURNS ALL THE USERS IN THE DATABASE

exports.findAll = (req, res) => {
  User.findAll()
    .then(val => res.status(200).send(val))
    .catch(err => res.status(500).send(err));
};

// GETS A SINGLE USER FROM THE DATABASE

exports.findOne = (req, res) => {
  User.findById(req.params.id)
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
