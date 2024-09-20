const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

// Register user
exports.register = async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
  db.query(query, [username, hashedPassword, email], (err, result) => {
    if (err) throw err;
    res.send('User registered');
  });
};

// Login user
exports.login = (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';

  db.query(query, [username], async (err, result) => {
    if (err) throw err;
    if (result.length === 0) return res.status(404).send('User not found');

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(403).send('Invalid credentials');

    const token = jwt.sign({ id: user.id }, 'SECRET_KEY', { expiresIn: '1h' });
    res.json({ token });
  });
};