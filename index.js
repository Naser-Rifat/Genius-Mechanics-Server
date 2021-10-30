const express = require('express');
const cors = require("cors");
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;


// middelware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g0xoz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {
        await client.connect();
        console.log('ok')

        const database = await client.db('CarMechanic');
        const datacollection = await database.collection('services');


        // POST 
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await datacollection.insertOne(service);
            console.log(service);
            res.json(result)

        })
        // GET 
        app.get('/services', async (req, res) => {
            const cursor = await datacollection.find({})
            const services = await cursor.toArray();
            console.log(services);
            res.json(services)

        })
        // GET  by ID
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const services = await datacollection.findOne(query);
            console.log(services);
            res.json(services)

        })
        // Deleted
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const services = await datacollection.deleteOne(query);
            console.log(services);
            res.json(services)

        })



    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    console.log("hit the server");
    res.send(" server running")
})

app.get("/hello", (req, res) => {
    res.send("hello")
})

app.listen(port, () => {
    console.log("server running", port)

})
