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
        const completeCollection = client.db("Todo-app").collection("completed");

        app.post('/tasks', async (req,res) =>{
            const data = req.body
            const sendTask = await taskCollection.insertOne(data)
            res.send(sendTask)

        })
        app.get('/tasks', async (req,res) =>{
            const email = req.query.email
            const cursor = {email : email}
            const getTask = await taskCollection.find(cursor).toArray()
            res.send(getTask)
        })
        app.delete('/tasks/:id', async (req,res) =>{
            const id = req.params.id
            const cursor = {_id : ObjectId(id)}
            const deleteTask = await taskCollection.deleteOne(cursor)
            res.send(deleteTask)
        })
         
        app.delete('/tasks_complete/:id', async (req,res) =>{
            const id = req.params.id
            const cursor = {_id : (id)} 
            const deleteData = await completeCollection.deleteOne(cursor)
            res.send(deleteData)
        })
        app.post('/tasks_complete/:id', async (req,res) =>{
            const body = req.body
            const id = req.params.id
            const cursor = {_id : ObjectId(id)}
            const deleteTask = await taskCollection.deleteOne(cursor)
            const sendCompleteTask = await completeCollection.insertOne(body)
            res.send(sendCompleteTask) 
        })
        app.get('/tasks_complete', async (req,res) =>{
            const email = req.query.email
            const cursor = {email:email}
            const getCompleteTask = await completeCollection.find(cursor).toArray()
            res.send(getCompleteTask) 
        })

        app.patch('/tasks/:id', async (req,res) =>{
            const id = req.params.id
            const filter = {_id:ObjectId(id)}
            const body = req.body
            console.log(body)
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  taskData : body.taskData
                },
              };
              const result = await taskCollection.updateOne(filter, updateDoc, options);
              res.send(result)
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