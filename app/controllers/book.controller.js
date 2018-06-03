const Book = require('../models/book.model.js');
const BookFile = require('../models/book.file.model.js');
const ImageFile = require('../models/image.file.model.js');
const EPub = require('epub');
const fs = require('fs');

// Create Ebook from metadata

function createEbook(epub, res, req, id) {
  epub.getImage('cover-image', (err, img, mimeType) => {
    const imgFile = new ImageFile({
      image: {
        data: img,
        contentType: mimeType,
      },
    });
    imgFile.save()
      .then((data) => {
        const book = new Book({
          title: epub.metadata.title,
          creator: epub.metadata.creator,
          creatorFileAs: epub.metadata.creatorFileAs,
          language: epub.metadata.language,
          subject: epub.metadata.subject,
          date: epub.metadata.date,
          description: epub.metadata.description,
          publisher: epub.metadata.publisher,
          contributors: epub.metadata.contributors,
          type: epub.metadata.type,
          format: epub.metadata.format,
          indentifier: epub.metadata.indentifier,
          source: epub.metadata.source,
          relation: epub.metadata.relation,
          coverage: epub.metadata.coverage,
          rights: epub.metadata.rights,
          book: id,
          cover: data.id,
        });
        book.save()
          .then(bookData => res.send(bookData))
          .catch(errb => res.status(500).send({ message: errb.message || 'Somme error occured while creating the node.' }));
      })
      .catch(errc =>
        res.status(500)
          .send({
            message: errc.message || 'Somme error occured while creating the node.',
          }));
  });
}

function saveEbookInDatabase(epub, res, req, callback) {
  const book = new BookFile({
    book: {
      data: fs.readFileSync(`${process.env.ROOTDIRECTORY}\\${req.file.path}`),
    },
  });
  book.save()
    .then((data) => {
      callback(epub, res, req, data.id);
    })
    .catch(err =>
      res.status(500)
        .send({
          message: err.message || 'Somme error occured while creating the node.',
        }));
}


// Create and Save a new Note
exports.create = (req, res) => {
  const epub = new EPub(`${process.env.ROOTDIRECTORY}\\${req.file.path}`);

  epub.on('end', (err) => {
    saveEbookInDatabase(epub, res, req, (_epub, _res, _req, _id) => {
      createEbook(_epub, _res, _req, _id);
    });
    if (err) {
      res.status(500).send('Server fot some problem with the ebook');
    }
  });
  epub.parse();
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
  Book.find()
    .then((book) => {
      res.send(book);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving books.',
      });
    });
};

exports.findOne = (req, res) => {
  Book.findById(req.params.bookId)
    .then((book) => {
      if (!book) {
        return res.status(404).send({
          message: `Book not found with id ${req.params.bookId}`,
        });
      }
      res.setHeader('Content-Type', 'application/json');
      return res.send(book);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: `Book not found with id ${req.params.bookId}`,
        });
      }
      return res.status(500).send({
        message: `Error retrieving book with id  ${req.params.bookId}`,
      });
    });
};

exports.findOneImage = (req, res) => {
  Book.findById(req.params.bookId)
    .then((book) => {
      if (!book) {
        return res.status(404).send({
          message: `Book not found with id ${req.params.bookId}`,
        });
      }
      ImageFile.findById(book.cover)
        .then((imageFile) => {
          if (!imageFile) {
            return res.status(404).send({
              message: `Image Book not found with id ${book.cover}`,
            });
          }
          res.setHeader('Content-Type', imageFile.image.contentType);
          res.send(imageFile.image.data);
        })
        .catch((err) => {
          if (err.kind === 'ObjectId') {
            return res.status(404).send({
              message: `Book not found with id ${book.cover[0]}`,
            });
          }
          return res.status(500).send({
            message: `Error retrieving Imagebook with id  ${err}`,
          });
        });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: `Book not found with id ${req.params.bookId}`,
        });
      }
      return res.status(500).send({
        message: `Error retrieving book with id  ${req.params.bookId}`,
      });
    });
};

// Find a single note with a noteId
exports.findOnefile = (req, res) => {
  Book.findById(req.params.bookId)
    .then((book) => {
      if (!book) {
        return res.status(404).send({
          message: `Book not found with id ${req.params.bookId}`,
        });
      }
      BookFile.findById(book.book)
        .then((bookFile) => {
          if (!bookFile) {
            return res.status(404).send({
              message: `Book not found with id ${req.params.bookId}`,
            });
          }
          res.setHeader('Content-Disposition', `attachment; filename=${book.title} ${book.creator || book.author}.epub`);
          res.setHeader('Content-Transfer-Encoding', 'binary');
          res.setHeader('Content-Type', 'application/octet-stream');
          return res.send(book.book.data);
        })
        .catch((err) => {
          if (err.kind === 'ObjectId') {
            return res.status(404).send({
              message: `BookFile not found with id ${req.params.bookId}`,
            });
          }
          return res.status(500).send({
            message: `Error retrieving book with id  ${req.params.bookId}`,
          });
        });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: `Book not found with id ${req.params.bookId}`,
        });
      }
      return res.status(500).send({
        message: `Error retrieving book with id  ${req.params.bookId}`,
      });
    });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
  Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(val => res.status(200).send(val))
    .catch(err => res.status(500).send(err));
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
  Book.findByIdAndRemove(req.params.id)
    .then(val => res.status(200).send(val))
    .catch(err => res.status(500).send(err));
};

