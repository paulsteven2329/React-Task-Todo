// backend/config/db.js
// Handles MongoDB connection, adhering to SRP (Single Responsibility Principle).
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Removed deprecated options
    console.log('MongoDB connected');
  } catch (error) {
    console.error('DB Connection Error:', error);
    process.exit(1); // Exit if DB fails
  }
};

module.exports = connectDB;