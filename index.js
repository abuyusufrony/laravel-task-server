const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const uri = "mongodb+srv://posttask:IDzMcPX3YRGTjZcG@cluster0.kliutox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";






const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        const postcolletion = client.db('postDB').collection('post');


        app.post('/addpost', async (req, res) => {
            const newpost = req.body;
            const result = await postcolletion.insertOne(newpost)
            res.send(result);
        })

        app.get('/post', async (req, res) => {
            const cursor = postcolletion.find()
            const result = await cursor.toArray()
            res.send(result)

        })

        app.get('/post/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await postcolletion.findOne(filter)
            res.send(result)
        })
        const { ObjectId } = require('mongodb');


        app.put('/post/:id', async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;

            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    title: updatedData.title,
                    description: updatedData.description,
                }
            };

            try {
                const result = await postcolletion.updateOne(filter, updateDoc);
                if (result.matchedCount === 0) {
                    return res.status(404).send({ message: "Post not found." });
                }
                res.send({ success: true, result });
            } catch (error) {
                console.error('Error updating post:', error);
                res.status(500).send({ success: false, error: 'Failed to update post.' });
            }
        });


        app.delete('/post/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const result = await postcolletion.deleteOne(filter)
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Laravel tasks are running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
