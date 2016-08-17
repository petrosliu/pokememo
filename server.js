var express = require('express');
var app = express();
var mongoose = require('mongoose');

mongoose.connect('mongodb://admin:admin@ds139985.mlab.com:39985/pokememo');
app.configure(function () {
    // set the static files location /public/img will be /img for users
    app.use(express.static(__dirname));
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

var pokedex = require('./models/pokedex');
var PokedexDB = mongoose.model('Pokedex', pokedex.schema);
PokedexDB.collection.remove({});
PokedexDB.collection.insert(pokedex.pokedex, function (err) {
    if (err) {
        console.log('Oh?');
    } else {
        console.log('%d pokemons were successfully loaded in Pokedex.', pokedex.pokedex.length);
    }
});



// ----- define routes
// get all todos
app.get('/api/todos', function (req, res) {
    // use mongoose to get all todos in the database
    Todo.find(function (err, todos) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(todos); // return all todos in JSON format
    });
});

// create Todo and send back all todos after creation
app.post('/api/todos', function (req, res) {
    // create a Todo, information comes from AJAX request from Angular
    Todo.create({
        text: req.body.text,
        done: false
    }, function (err, todo) {
        if (err) {
            res.send(err);
        }
        // get and return all the todos after you create another
        Todo.find(function (err, todos) {
            if (err) {
                res.send(err);
            }
            res.json(todos);
        });
    });
});
// delete a todo
app.delete('/api/todos/:todo_id', function (req, res) {
    Todo.remove({
        _id: req.params.todo_id
    }, function (err, todo) {
        if (err)
            res.send(err);
        // get and return all the todos after you create another
        Todo.find(function (err, todos) {
            if (err) {
                res.send(err);
            }
            res.json(todos);
        });
    });
});


app.get('/api/pokedex', function (req, res) {
    PokedexDB.find(function (err, pokedex) {
        if (err) {res.send(err);}
        res.json(pokedex);
    });
});

app.get('/api/pokedex/:id', function (req, res) {
    PokedexDB.findOne({'id':req.params.id}, function (err, pokemon) {
        if (err) {res.send(err);}
        res.json(pokemon);
    });
});

// get the index.html
app.get('/', function (req, res) {
    res.sendfile('index.html');
});
app.get('*', function (req, res) {
    res.redirect('/');
});