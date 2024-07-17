const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 2001;
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const dbName = 'web_mongodb';
const collectionName = 'user_profiles';

app.use(express.json()); // To parse request bodies

// Function to connect to MongoDB and return the collection
async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const database = client.db(dbName);
        return database.collection(collectionName);
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
}

// Endpoint to retrieve all documents
app.get('/', async (req, res) => {
    const collection = await connectToDatabase();
    const data = await collection.find({}).toArray();
    res.json(data);
});

// Endpoint to add a new document
app.post('/add', async (req, res) => {
    const collection = await connectToDatabase();
    const newDocument = req.body;
    const result = await collection.insertOne(newDocument);
    console.log(`Inserted document with _id: ${result.insertedId}`);
    res.json(result);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
