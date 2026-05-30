const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = 3000
const uri = "mongodb+srv://pawmart-db:pawmart1234@cluster0.jfbqb9o.mongodb.net/?appName=Cluster0";
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send('Hello World!')
})

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {

    await client.connect();
    const db=client.db('pawmart-db')
    const listingsCollection=db.collection('listings') 
    const ordersCollection=db.collection('orders')
   
app.get ('/listings',async(req,res)=>{
  const result=await listingsCollection.find().toArray()
  res.send(result)
})

app.get("/recent-listings", async (req, res) => {
  const result = await listingsCollection.find().limit(6).toArray();
  res.send(result);
});

app.get("/products/category/:categoryName", async (req, res) => {
    const categoryName = decodeURIComponent(req.params.categoryName);
  const result = await listingsCollection.find({ category: categoryName }).toArray();
  res.send(result);
});
  
app.post('/listings', async (req, res) => {
  const newListing = req.body; 
  const result = await listingsCollection.insertOne(newListing);
  res.send(result);
});

app.get('/listings/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await listingsCollection.findOne(query);
  res.send(result);
});

app.post('/orders', async (req, res) => {
  const newOrder = req.body; 
  const result = await ordersCollection.insertOne(newOrder);
  res.send(result);
});

app.get('/orders', async (req, res) => {
  const email = req.query.email;
  const query = { email };
  const result = await ordersCollection.find(query).toArray();
  res.send(result);
});

app.get('/my-listings', async (req, res) => {
  const email = req.query.email;
  const query = { email };
  const result = await listingsCollection.find(query).toArray();
  res.send(result);
});

app.delete('/my-listings/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await listingsCollection.deleteOne(query);
  res.send(result);
});

app.put('/my-listings/:id', async (req, res) => {

  const id = req.params.id;
  const updatedData = req.body;

  const query = { _id: new ObjectId(id) };
  const update = { $set: updatedData };
  const result = await listingsCollection.updateOne(query, update);
  res.send(result);
});


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
   
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
