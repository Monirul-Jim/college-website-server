const express = require('express');
require('dotenv').config()
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERS}:${process.env.DB_PASS}@cluster0.dsd2lyy.mongodb.net/?retryWrites=true&w=majority`;

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
    const photoCollection = client.db("college-website").collection("photo-collection");
    const reviews = client.db("college-website").collection("testimonial");
    const details = client.db("college-website").collection("details");
    const admission = client.db("college-website").collection("admission");
    const reviewCollection = client.db("college-website").collection("review");
    const studentAdmission = client.db("college-website").collection("student-admission");
    app.get("/photo", async (req, res) => {
      const result = await photoCollection.find().toArray()
      res.send(result)
    })
    app.get("/client-review", async (req, res) => {
      const result = await reviews.find().toArray()
      res.send(result)
    })
    app.get('/college-details', async (req, res) => {
      const result = await details.find().toArray()
      res.send(result)
    })
    app.get('/college/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await details.findOne(query);
      res.send(result);
    });
    app.post('/review-collection', async (req, res) => {
      const reviews = req.body;
      const result = await reviewCollection.insertOne(reviews);
      res.send(result);
    });
    app.get("/student-review", async (req, res) => {
      const result = await reviewCollection.find().toArray()
      res.send(result)
    })
    app.post('/student-admissions', async (req, res) => {
      const admission = req.body;
      const result = await studentAdmission.insertOne(admission);
      res.send(result);
    });


    app.get('/get-admission-info', async (req, res) => {

      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await studentAdmission.find(query).toArray()
      res.send(result)
    })
    // search by college name
    app.get('/college-search/:text', async (req, res) => {
      const searchText = req.params.text;
      const result = await details.find({
        $or: [
          { name: { $regex: searchText, $options: "i" } }
        ],
      }).toArray()
      res.send(result)
    })

    app.get('/admission-college', async (req, res) => {
      const result = await admission.find().toArray()
      res.send(result)
    })
    app.get('/admit-college/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await admission.findOne(query);
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('hello there')
})

app.listen(port, () => {
  console.log(`college ${port}`);
})
