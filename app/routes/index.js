//URL shortner

'use strict';
var url = require('url'),
    valid = require('valid-url');
var port = process.env.PORT || 3000;

module.exports = function (app, db) {
//this creates a new instance of a controller, and passes it the variable of the database
    //var serverController = new serverController(db);

    //defining a new route for our API
    // /api doesn't actually exist as a folder, but it's a route that the DB uses? or something?
      /*  app.route('/api/clicks')
            .get(clickHandler.getClicks)
            .post(clickHandler.addClicks)
            .delete(clickHandler.resetClicks);
    */
    app.get('/', function (req,res) {
        res.sendFile(process.cwd() + '/public/index.html');
      });

    app.get('/newlink/:location*', function (req,res) {
      //this takes a url and either returns the current shortlink or makes a new shortlink and returns that
        var orig = req.originalUrl || req.url;
        var pathname = url.parse(orig).pathname;
        var naked_url = pathname.substring(9);

        //Verify, then either add to DB or look up current entry and return JSON
        handleLongURL(res, naked_url);

        });

    app.get('/:shortlink', function(req, res) {
      var orig = req.originalUrl || req.url;
      var path = url.parse(orig).path;
      //var naked_url = pathname.substring(9);

      if (path != '/favicon.ico') {
        handleShortUrl(res, path);
      }
    });



    function handleShortUrl(res, short_url) {
      db.collection('sites').findOne({
        "short_url_suffix" : short_url.substring(1)
      }, function(err, result) {
        if (err) throw err;
        if (result) {
          res.redirect(result.original_url);
        } else {
          res.send('This shortened link does not exist in our database. Please add the site you are looking for using /newlink/[address]');
        }
      });
    }//handleShortUrl function

    function handleLongURL(res, longURL) {
      var newLinkPref = process.env.APP_URL || 'localhost:'+port+"/";
      var shortAndLongofit;
      if (!valid.isUri(longURL)){
        res.send(longURL+" is not a valid address. Please enter a proper url.");
      } else {
      db.collection('sites').findOne({
        'original_url':longURL
      }, function(err,result) {
        if (err) throw err;
        //if there is a DB entry:
        if (result) {
          console.log(result);
          //return JSON with short and long URL
          shortAndLongofit = //result.original_url+", "+result.short_url_suffix;
          {
            'original_url':result.original_url,
            'short_url_suffix':newLinkPref+result.short_url_suffix
          };
        } else {


         var newLinkSuff = generateLinkSuffix();
         var newLink = newLinkPref+newLinkSuff;
          //make a new entry in the DB and return like above
          db.collection('sites').insert({
            'original_url':longURL,
            'short_url_suffix':newLinkSuff
          });//db insert

          shortAndLongofit = {
            'original_url':longURL,
            'short_url':newLink
          };
        }
        res.send(shortAndLongofit);
      });//db.findOne function
     }//URL validity check
    }///handle long URL function

    function randomNumber () {
      return Math.floor(Math.random()*10);
    }
    function generateLinkSuffix() {
      var words = ['apple', 'banana', 'cherry', 'date', 'entawak', 'fig', 'guava','honeydew','imbe', 'jackfruit','kiwi','lime', 'melon', 'nectarine', 'olive', 'pawpaw', 'quince', 'rambutan', 'strawberry', 'tamarind', 'ugni', 'voavanga', 'watermelon', 'yangmei', 'zucchini'];
      var number = [randomNumber(),randomNumber(),randomNumber(),randomNumber()];
      var randLink = words[Math.floor(Math.random()*(words.length))] +number.join('');
      console.log(randLink);
      return randLink;
    }
};//module exports function
