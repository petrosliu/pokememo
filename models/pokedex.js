var mongoose = require('./mongodb');


var pokedexSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pokemon: Number,
    candy: String,
    candy_amount: { type: Number, min: 0, default: 0 }
});

pokedexSchema.set('toObject', {
    virtuals: true
});
pokedexSchema.set('toJSON', {
    virtuals: true
});

var PokedexDB = mongoose.model('Pokedex', pokedexSchema);

var getPokedex = function (user, callback) {
    PokedexDB.find({ user: user }, function (err, pokedex) {
        if (err) callback(err);
        else callback(err, pokedex);
    });
};

var registerPokedex = function (user, pokemon, callback) {
    PokedexDB.findOne({ user: user, pokemon: pokemon.id }, function (err, pokedex) {
        if (!pokedex) {
            var pokedex = new PokedexDB({
                user: user,
                pokemon: pokemon.id,
                candy: pokemon.candy
            });
            pokedex.save(function (err) {
                callback(err);
            });
        }
        else callback(err);
    });
};

var deregisterPokedex = function (user, pokemon, callback) {
    PokedexDB.remove({
        user: user,
        pokemon: pokemon.id
    }, function (err) {
        callback(err);
    });
};

var updatePokedex = function (user, candy, candy_amount, callback) {
    PokedexDB.update({ user: user, candy: candy }, { candy_amount: candy_amount }, { multi: true }, function (err, num) {
        callback(err);
    });
};

module.exports.get = getPokedex;
module.exports.register = registerPokedex;
module.exports.deregister = deregisterPokedex;
module.exports.update = updatePokedex;