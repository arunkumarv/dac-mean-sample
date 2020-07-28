const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 4000

app.set ( 'view engine', 'ejs' );

app.use(bodyParser.urlencoded({ extended: false }))
 
app.use(bodyParser.json())

const MongoClient = require('mongodb').MongoClient;

/* Edit host and port */
const url = 'mongodb://localhost:27017';

/* Edit with your db name if requiredd */
const dbName = 'myproject';

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {

    console.log("Connected successfully to server");

    const db = client.db(dbName);

    /* Specify a collection name instead of documents */
    const collection = db.collection('documents');

    app.get('/', (req, res) => {

        res.render('doc-form')
    })

    app.post('/', (req, res) => {
        
        let document = req.body;
        
        console.log ( document );

        collection.insertOne(document, function (err, result) {

            if (err) console.log (err);

            res.render('doc-form');
        });
    });

    app.get ('/show-data', function(req, res){

        collection.find().toArray(function(err, result) {

            if(err) {

                console.log(err);

                res.status('400').send({error: err});

            } else if(result.length) {

                // console.log(result);

                res.render('show-data', { result });

            } else {

                console.log('No document(s) found with defined "find" criteria!');

                res.status('400').send({error: 'No document(s) found'});
            }
            
        });
    });

    app.listen(port, () => console.log(`App http://localhost:${port}`))


});