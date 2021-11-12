const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.port || 5000

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nbt3a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
  try{
    await client.connect();
    const database = client.db('lightShouseOnlineShop');
    const productCollection= database.collection('products');
    const trendyProductCollection= database.collection('trendyProducts');
    const orderCollection= database.collection('orders');


    // Api for all products
    app.get('/products',async(req,res) =>{
      const cursor = productCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    })
    // Api for trendy Products
    app.get('/trendyProducts',async(req,res) =>{
      const cursor = trendyProductCollection.find({});
      const trendyProducts = await cursor.toArray();
      res.send(trendyProducts);
    })

    // get single products
    app.get('/products/:id', async(req,res)=>{
      const id= req.params.id;
      const query ={_id: ObjectId(id)};
      const product = await productCollection.findOne(query);
      res.json(product);
    })

    // Post orders
    app.post('/orders', async(req,res)=>{
      const order = req.body;
      console.log(order)
      const result = await orderCollection.insertOne(order);
      res.json(result)
    })
  }
    
  finally{
    // await client.close();
  }
}

run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('This is light House Website server');
})

app.listen(port, () => {
  console.log("Assignment-12 running on port -", port);
})