const mongoose = require('mongoose');
require('dotenv').config()

const mongoURL = process.env.MongoURL;

(async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log('✅ Connected to MongoDB');
    console.log(process.env.jwtsecret);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
})();

const db = mongoose.connection;

// Event listeners (optional but good for debugging)
db.on('disconnected', () => {
  console.log('🔌 Disconnected from MongoDB');
});

module.exports = db;
