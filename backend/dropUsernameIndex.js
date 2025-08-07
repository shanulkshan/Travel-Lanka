const mongoose = require('mongoose');
require('dotenv').config();

async function dropUsernameIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the users collection
    const db = mongoose.connection.db;
    const collection = db.collection('users');

    // Check if username index exists
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));

    // Drop the username index if it exists
    const usernameIndexExists = indexes.some(idx => idx.name === 'username_1');
    
    if (usernameIndexExists) {
      await collection.dropIndex('username_1');
      console.log('Successfully dropped username_1 index');
    } else {
      console.log('username_1 index does not exist');
    }

    // List indexes after dropping
    const updatedIndexes = await collection.indexes();
    console.log('Updated indexes:', updatedIndexes.map(idx => idx.name));

  } catch (error) {
    console.error('Error dropping username index:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

dropUsernameIndex();