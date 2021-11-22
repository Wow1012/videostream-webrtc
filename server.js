const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require("cors");

const app = express();
app.use(cors());

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/streamers', require('./routes/api/streamers'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/upload', require('./routes/api/upload'));

//SERVING IMAGES
app.use('/images', express.static('images'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
