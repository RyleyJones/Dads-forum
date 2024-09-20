const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const forumRoutes = require('./routes/forumRoutes');
const authController = require('./controllers/authController');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Authentication Routes
app.post('/register', authController.register);
app.post('/login', authController.login);

// Forum Routes
app.use('/forum', forumRoutes);

const server = app.listen(3000, () => console.log('Server running on port 3000'));

// Real-time updates with WebSockets
const io = require('socket.io')(server, {
  cors: { origin: '*' }
});

io.on('connection', socket => {
  console.log('New user connected');

  socket.on('new-post', post => {
    io.emit('refresh-posts', post);
  });
});