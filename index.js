const express = require("express");
const app = express()
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//Middlewere...
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hlokssy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const database = client.db("coffeeCollection");
    const haiku = database.collection("Coffee");


    app.get('/coffee', async(req, res) =>{
        const cursor = haiku.find()
        const result = await cursor.toArray()
        res.send(result)
    })


    app.get('/coffee/:id', async(req, res) =>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await haiku.findOne(query)
        res.send(result)
    })


    app.post('/coffee', async (req, res) => {
        const newCoffee = req.body;
        console.log(newCoffee);
        const result = await haiku.insertOne(newCoffee);
        res.send(result)
    })


    app.put('/coffee/:id', async(req, res)=>{
        const id = req.params.id
        const filter = {_id: new ObjectId(id)}
        console.log(id);
        const options = {upset: true}
        const updatedCoffee = req.body
        const coffee ={
            $set: {
                name: updatedCoffee.name,
                quantity: updatedCoffee.quantity,
                supplier: updatedCoffee.supplier,
                taste: updatedCoffee.taste,
                category: updatedCoffee.category,
                details: updatedCoffee.details,
                photo: updatedCoffee.photo
            }
        }
        const result = await haiku.updateOne(filter, coffee, options)
        res.send(result)
    })


    app.delete('/coffee/:id', async(req, res)=>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await haiku.deleteOne(query)
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('Coffee server is running on.....')
})


app.listen(port, ()=>{
    console.log(`the port is running on: ${port}`);
})