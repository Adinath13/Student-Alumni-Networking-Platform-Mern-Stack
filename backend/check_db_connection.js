const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const checkConnection = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');

        // Write URI to file to avoid terminal wrapping issues
        fs.writeFileSync('uri.txt', process.env.MONGO_URI);
        console.log('URI written to uri.txt');

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database Name: ${conn.connection.db.databaseName}`);

        const collections = await conn.connection.db.listCollections().toArray();
        console.log('\nCollections in database:');
        collections.forEach(c => console.log(` - ${c.name}`));

        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

checkConnection();
