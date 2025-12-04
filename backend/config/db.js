const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string (masked):', process.env.MONGO_URI ? 'Present' : 'MISSING!');

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ MongoDB Connected Successfully!');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Port: ${conn.connection.port}`);

    // List all collections to verify data exists
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`   Collections (${collections.length}):`, collections.map(c => c.name).join(', '));

  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    console.error(`   Full Error:`, error);
    process.exit(1);
  }
};

module.exports = connectDB;
