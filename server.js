var express = require('express');
var app = express();

app.configure(function () {
    // set the static files location /public/img will be /img for users
    app.use(express.static(__dirname + '/public'));
    // log every request to the console
    app.use(express.logger('dev'));
    // pull information from html in POST
    app.use(express.urlencoded())
    app.use(express.json())
});
app.listen(process.env.PORT || 8080);
console.log("App listening on port %d", process.env.PORT || 8080);

// ----- include models

var pokedex = require('./models/pokedex');
var user = require('./models/user');

// ----- define routes
app.get('/api/pokedex', function (req, res) {
    pokedex.getAll(function (err, pokemons) {
        if (err) {res.send(err);}
        else res.json(pokemons);
    });
});

app.get('/api/pokedex/:id', function (req, res) {
    pokedex.get(req.params.id,function (err, pokemon) {
        if (err) {res.send(err);}
        else res.json(pokemon);
    });
});

// get the index.html
app.get('/', function (req, res) {
    res.sendfile('index.html');
});
app.get('*', function (req, res) {
    res.redirect('/');
});