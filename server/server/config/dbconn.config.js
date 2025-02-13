const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

const mongoUri = process.env.MONGO_DB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to mongodb');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
};

module.exports = connectDB;

// mongoose.connect(mongoUri);
// const db = mongoose.connection;
// db.on('error' , console.error.bind(console , 'connection error'));
// db.once('open' , () => {
// console.log('Connected to mongodb');
// });