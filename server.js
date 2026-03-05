const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });

const app = require('./app');

// Connect to MongoDB
const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then(() => {
    console.log('MongoDB connection successful!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});