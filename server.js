var express = require('express');
var app = express();
var config = require('./config.js');

app.configure(function () {
  // set the static files location /public/img will be /img for users
  app.use(express.static(__dirname + '/public'));
  // log every request to the console
  app.use(express.logger('dev'));
  // pull information from html in POST
  app.use(express.urlencoded());
  app.use(express.json());
});

app.listen(config.PORT || 8080);
console.log("App listening on port %d", config.PORT || 8080);

// ----- include models

var Pokemon = require('./models/pokemon');
var User = require('./models/user');
var Pokedex = require('./models/pokedex');
var Spawn = require('./models/spawn');

// ----- define routes
app.get('/api/pokemons', function (req, res) {
  Pokemon.get(function (err, pokemons) {
    if (err) { res.send(err); }
    else res.json(pokemons);
  });
});

app.get('/api/pokemons/:id', function (req, res) {
  Pokemon.get(req.params.id, function (err, pokemon) {
    if (err) { res.send(err); }
    else res.json(pokemon);
  });
});

app.post('/api/users/login', function (req, res) {
  User.get(req.body.username, function (err, user) {
    if (err) res.send(err);
    else if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      if (!user.validPassword(req.body.password)) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      }
      else {
        var token = user.generateJwt();
        res.json({
          success: true,
          message: 'Token generated.',
          token: token
        });
      }
    }
  });
});

app.post('/api/users/signup', function (req, res) {
  User.get(req.body.username, function (err, user) {
    if (err) res.send(err);
    else if (user) res.json({ success: false, message: 'Username has already been taken.' });
    else {
      User.set(req.body.username, req.body.password, function (err) {
        if (err) res.send(err);
        else res.json({
          success: true,
          message: 'Username signed up successfully.'
        });
      });
    }
  });
});

app.get('/api/users', function (req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    User.auth(token, function (err, user) {
      if (err) res.send(err);
      else if (!user) {
        res.json({
          success: false,
          message: 'User not found.'
        });
      }
      else {
        res.json({
          success: true,
          message: 'Token verified.',
          user: user
        });
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

app.post('/api/users', function (req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    User.auth(token, function (err, user) {
      if (err) res.send(err);
      else if (!user) {
        res.json({
          success: false,
          message: 'User not found.'
        });
      }
      else {
        User.update(user.id, req.body.update, function (err) {
          if (err) res.send(err);
          else res.json({
            success: true,
            message: 'User updated.'
          });
        });
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

app.get('/api/pokedex', function (req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    User.auth(token, function (err, user) {
      if (err) res.send(err);
      else {
        Pokedex.get(user, function (err, pokedex) {
          if (err) res.send(err);
          else res.json(pokedex);
        });
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

app.post('/api/pokedex', function (req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    User.auth(token, function (err, user) {
      if (err) res.send(err);
      else {
        Pokemon.get(req.body.pokemon, function (err, pokemon) {
          if (err) { res.send(err); }
          else {
            Pokedex.register(user, pokemon, function (err) {
              if (err) res.send(err);
              else res.json({
                success: true,
                message: 'Registered.'
              });
            });
          }
        });
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});


app.delete('/api/pokedex/:id', function (req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    User.auth(token, function (err, user) {
      if (err) res.send(err);
      else {
        Pokemon.get(req.params.id, function (err, pokemon) {
          if (err) { res.send(err); }
          else {
            Pokedex.deregister(user, pokemon, function (err) {
              if (err) res.send(err);
              else res.json({
                success: true,
                message: 'Deregistered.'
              });
            });
          }
        });
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

app.post('/api/pokedex/:id', function (req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    User.auth(token, function (err, user) {
      if (err) res.send(err);
      else {
        Pokemon.get(req.params.id, function (err, pokemon) {
          if (err) res.send(err);
          else {
            Pokedex.update(user, pokemon.candy, req.body.candy_amount, function (err) {
              if (err) res.send(err);
              else res.json({
                success: true,
                message: 'Candy updated.'
              });
            });
          }
        });
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

app.get('/api/spawns', function (req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    User.auth(token, function (err, user) {
      if (err) res.send(err);
      else {
        Spawn.get(user, function (err, spawns) {
          if (err) res.send(err);
          else res.json(spawns);
        });
      }
    });
  } else {
    Spawn.get(function (err, spawns) {
      if (err) res.send(err);
      else res.json(spawns);
    });
  }
});

app.post('/api/spawns', function (req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    User.auth(token, function (err, user) {
      if (err) res.send(err);
      else {
        Spawn.set(user, req.body.latitude, req.body.longitude, req.body.pokemon, function (err) {
          if (err) res.send(err);
          else res.json({
            success: true,
            message: 'Spawn updated.'
          });
        });
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

// get the index.html
app.get('/', function (req, res) {
  res.sendfile('public/index.html');
});
app.get('/spawn', function (req, res) {
  res.sendfile('public/views/spawn.html');
});
app.get('*', function (req, res) {
  res.redirect('/');
});