require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;
const admin = require("firebase-admin");
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
// index.js
const decoded = Buffer.from(process.env.FIREBASE_SERVICE_KEY, "base64").toString("utf8");
const serviceAccount = JSON.parse(decoded);

initializeApp({
  credential: cert(serviceAccount),
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jfbqb9o.mongodb.net/?appName=Cluster0`;
//middlewares
app.use(cors())
app.use(express.json())

const logger=(req,res,next)=>{
  next();
}



const verifyFirebaseToken = async (req, res, next) => {
  if(!req.headers.authorization ) {
    return res.status(401).send({ message: 'Unauthorized access' });
  }
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized access' });
  }
try{
  const userInfo=await getAuth().verifyIdToken(token);
  req.token_email=userInfo.email;
  next();
} 
catch (error) {
  return res.status(401).send({ message: 'Unauthorized access' });
}
 
}
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

app.get('/my-listings',logger,verifyFirebaseToken, async (req, res) => {
  console.log('headers:',req)
  const email = req.query.email; 
  const query = { email };
  if (req.token_email !== email) {
    return res.status(403).send({ message: 'Forbidden access' });
  }
  const result = await listingsCollection.find(query).toArray();
  res.send(result);
});

app.delete('/my-listings/:id',logger,verifyFirebaseToken, async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await listingsCollection.deleteOne(query);
  res.send(result);
});

app.put('/my-listings/:id',logger,verifyFirebaseToken, async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const query = { _id: new ObjectId(id) };
  const update = { $set: updatedData };
  const result = await listingsCollection.updateOne(query, update);
  res.send(result);
});



    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
   
  }
}
run().catch(console.dir);

