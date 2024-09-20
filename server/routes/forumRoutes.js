const express = require('express');
const { getThreads, createThread, createPost, deleteThread } = require('../controllers/forumController');
const { authenticateToken } = require('../controllers/authController');
const router = express.Router();

router.get('/threads', getThreads);
router.post('/thread', authenticateToken, createThread);
router.post('/post', authenticateToken, createPost);
router.delete('/thread', authenticateToken, deleteThread);

module.exports = router;