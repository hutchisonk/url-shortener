var express = require('express'),
    http = require('http'),
    routes = require('./app/routes/index.js'),
    mongo = require('mongodb').MongoClient;

var app = express();
var port = process.env.PORT || 3000;

//mongo.MongoClient.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/url-shortener', function(err, db) {
mongo.connect('mongodb://localhost:27017/url-shortener', function (err, db) {

      if (err) {
          throw new Error('Database failed to connect!');
      } else {
          console.log('MongoDB successfully connected on port 27017.');
      }

  app.use('/public', express.static(process.cwd() + '/public'));


  routes(app, db);

  //listening for our server within the scope of our db
  app.listen(port, function() {
    console.log('listening at port '+port);
  });

});//mongo connect
