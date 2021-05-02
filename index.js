const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');

const port = 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());


const pass = "arabianhorse79";


const uri = "mongodb+srv://arabian:arabianhorse79@cluster0.66naq.mongodb.net/burjAlArab?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const bookings = client.db("burjAlArab").collection("bookings");
  // perform actions on the collection object
  
  app.post('/addBooking', (req,res) => {
    const newBooking = req.body;
    bookings.insertOne(newBooking)
    .then( result => {
       res.send(result.insertedCount > 0 )
    })
    console.log(newBooking);
  })
  console.log("Database Connected")
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)