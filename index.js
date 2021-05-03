const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require("firebase-admin");
require('dotenv').config()

const port = 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.66naq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const serviceAccount = require("./configs/burj-al-arab-4a1f9-firebase-adminsdk-fzumt-b6822d5eb5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const bookings = client.db(process.env.DB_NAME).collection("bookings");
  // perform actions on the collection object

  app.post('/addBooking', (req, res) => {
    const newBooking = req.body;
    bookings.insertOne(newBooking)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    console.log(newBooking)
  });
  app.get('/bookings', (req, res) => {
    const bearer = req.headers.authorization;

    if (bearer && bearer.startsWith('Bearer ')) {
      const idToken = bearer.split(' ')[1];
      admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
          const tokenEmail = decodedToken.email;
          const queryEmail = req.query.email;
          if (tokenEmail === queryEmail) {
              bookings.find({ email: queryEmail })
              .toArray((err, documents) => {
                res.status(200).send(documents);
              })
          }else{
            res.status(401).send('401 Unauthorized Access')
          }
        })
        .catch((error) => {
          res.status(401).send('401 Unauthorized Access')
        });
    }else{
          res.status(401).send('401 Unauthorized Access')
    }

  })

  console.log("Database Connected")
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)