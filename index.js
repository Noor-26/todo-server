const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');

app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.okboq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
;
const run = async () => { 
    try{
        await client.connect()
        const taskCollection = client.db("Todo-app").collection("tasks");

        app.post('/tasks', async (req,res) =>{
            const data = req.body
            const sendTask = await taskCollection.insertOne(data)
            res.send(sendTask)
        })
    }
    finally{

    }
}
run()

app.get('/',(req,res) => {
    res.send('Success the surver is running')
})

app.listen(port,() => {
    console.log('Connections to the port done'); 
})