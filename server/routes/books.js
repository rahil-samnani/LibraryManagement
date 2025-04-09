const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const jwt = require('jsonwebtoken');

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, 'librarysecretkey');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }
    
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create new book (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, author, description, genre, price, copies, imageUrl } = req.body;
    
    const newBook = new Book({
      title,
      author,
      description,
      genre,
      price,
      copies,
      imageUrl
    });
    
    const book = await newBook.save();
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update book copies
router.patch('/:id/copies', auth, async (req, res) => {
  try {
    const { copies } = req.body;
    
    if (copies < 0) {
      return res.status(400).json({ msg: 'Copies cannot be negative' });
    }
    
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: { copies } },
      { new: true }
    );
    
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }
    
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update book
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, author, description, genre, price, copies, imageUrl } = req.body;
    
    const bookFields = {};
    if (title) bookFields.title = title;
    if (author) bookFields.author = author;
    if (description) bookFields.description = description;
    if (genre) bookFields.genre = genre;
    if (price) bookFields.price = price;
    if (copies !== undefined) bookFields.copies = copies;
    if (imageUrl) bookFields.imageUrl = imageUrl;
    
    let book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }
    
    book = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: bookFields },
      { new: true }
    );
    
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete book
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }
    
    await book.remove();
    res.json({ msg: 'Book removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
