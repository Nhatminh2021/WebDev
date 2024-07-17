const { MongoClient } = require('mongodb');

const uri = "mongodb://127.0.0.1:27017"; 
const client = new MongoClient(uri);

async function connect() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const database = client.db('web_mongodb'); 
        return database;
    } catch (err) {
        console.error(err);
    }
}

module.exports = { connect };
