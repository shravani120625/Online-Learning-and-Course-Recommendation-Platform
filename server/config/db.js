const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/online-learning-platform');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Trigger seed logic
    const { autoSeed } = require('../controllers/courseController');
    await autoSeed();
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
