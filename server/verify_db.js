require('dotenv').config({ debug: true });
const mongoose = require('mongoose');

// Trying direct IP connection to bypass DNS
const uri = "mongodb://kumarnay09_db_user:JhBwxUoLb4hCn4ex@159.41.243.1:27017/road2success?authSource=admin&tls=true&tlsInsecure=true";

if (!uri) {
    console.error("Error: MONGODB_URI is not defined in .env");
    process.exit(1);
}

console.log("Testing connection to:", uri.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs

mongoose.connect(uri)
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection failed:', err);
        if (err.name === 'MongoParseError') {
            console.error('Check your connection string format.');
        } else if (err.name === 'MongoNetworkError') {
            console.error('Check your internet connection or firewall settings.');
        }
        process.exit(1);
    });
