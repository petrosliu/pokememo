var express = require('express');
var app = express();

app.configure(function () {
    // set the static files location /public/img will be /img for users
    app.use(express.static(__dirname + '/public'));
    // log every request to the console
    app.use(express.logger('dev'));
    // pull information from html in POST
    app.use(express.urlencoded());
    app.use(express.json());
});

require('dotenv').config();
app.listen(process.env.PORT || 8080);
console.log("App listening on port %d", process.env.PORT || 8080);

// ----- include models

var Pokedex = require('./models/pokedex');
var User = require('./models/user');

// ----- define routes
app.get('/api/pokedex', function (req, res) {
    Pokedex.getAll(function (err, pokemons) {
        if (err) {res.send(err);}
        else res.json(pokemons);
    });
});

app.get('/api/pokedex/:id', function (req, res) {
    Pokedex.get(req.params.id,function (err, pokemon) {
        if (err) {res.send(err);}
        else res.json(pokemon);
    });
});

app.post('/login', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) res.send(err);
    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      if (!user.validPassword(req.body.password)) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        var token = user.generateJwt();
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  });
});


// get the index.html
app.get('/', function (req, res) {
    res.sendfile('index.html');
});
app.get('*', function (req, res) {
    res.redirect('/');
});