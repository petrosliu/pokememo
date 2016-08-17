var express = require('express');
var app = express();
var mongoose = require('mongoose');

mongoose.connect('mongodb://admin:admin@ds040489.mlab.com:40489/pokemon');
app.configure(function() {
    // set the static files location /public/img will be /img for users
    app.use(express.static(__dirname + '/public'));
    // log every request to the console
    app.use(express.logger('dev'));
    // pull information from html in POST
    app.use(express.urlencoded())
    app.use(express.json())
});
app.listen(8080);
console.log("App listening on port 8080");

// ----- define model
var Todo = mongoose.model('Todo', {
    text: String
});

var pokemon = require('./models/pokemon');
var PokemonDB = mongoose.model('Pokemon', pokemon.schema);
PokemonDB.collection.remove({});
PokemonDB.collection.insert(pokemon.allPokemons, function(err) {
    if (err) {
        console.log('Oh?');
    } else {
        console.log('%d pokemons were successfully loaded in Pokedex.', pokemon.allPokemons.length);
    }
});



// ----- define routes
// get all todos
app.get('/api/todos', function(req, res) {
    // use mongoose to get all todos in the database
    Todo.find(function(err, todos) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(todos); // return all todos in JSON format
    });
});

app.get('/api/pokemons', function(req, res) {
    // use mongoose to get all todos in the database
    PokemonDB.find(function(err, pokemons) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(pokemons); // return all todos in JSON format
    });
});

// create Todo and send back all todos after creation
app.post('/api/todos', function(req, res) {
    // create a Todo, information comes from AJAX request from Angular
    Todo.create({
        text: req.body.text,
        done: false
    }, function(err, todo) {
        if (err) {
            res.send(err);
        }
        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err) {
                res.send(err);
            }
            res.json(todos);
        });
    });
});
// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
    Todo.remove({
        _id: req.params.todo_id
    }, function(err, todo) {
        if (err)
            res.send(err);
        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err) {
                res.send(err);
            }
            res.json(todos);
        });
    });
});

// get the index.html
app.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

app.get('/pokemon', function(req, res) {
    res.sendfile('./public/pokemon.html');
});