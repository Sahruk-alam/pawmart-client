const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = 3000
const uri = "mongodb+srv://pawmart-db:pawmart1234@cluster0.jfbqb9o.mongodb.net/?appName=Cluster0";
app.use(cors())



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
   
app.get ('/listings',async(req,res)=>{
  const result=await listingsCollection.find().toArray()
  console.log(result)

  res.send(result)
})




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
   
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
