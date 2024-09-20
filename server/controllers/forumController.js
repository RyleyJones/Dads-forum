const db = require('../models/db');
const jwt = require('jsonwebtoken');

// Middleware for Authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(403);

  jwt.verify(token.split(' ')[1], 'SECRET_KEY', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Get all threads
exports.getThreads = (req, res) => {
  const query = 'SELECT * FROM threads';
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

// Create a thread
exports.createThread = (req, res) => {
  const { title } = req.body;
  const userId = req.user.id;

  const query = 'INSERT INTO threads (title, user_id) VALUES (?, ?)';
  db.query(query, [title, userId], (err, result) => {
    if (err) throw err;
    res.send('Thread created');
  });
};

// Create a post in a thread
exports.createPost = (req, res) => {
  const { content, threadId } = req.body;
  const userId = req.user.id;

  const query = 'INSERT INTO posts (content, thread_id, user_id) VALUES (?, ?, ?)';
  db.query(query, [content, threadId, userId], (err, result) => {
    if (err) throw err;
    res.send('Post created');
  });
};

// Delete thread (for moderation)
exports.deleteThread = (req, res) => {
  const { threadId } = req.body;
  const query = 'DELETE FROM threads WHERE id = ?';
  db.query(query, [threadId], (err, result) => {
    if (err) throw err;
    res.send('Thread deleted');
  });
};