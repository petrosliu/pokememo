var mongoose = require('./mongodb');

Array.prototype.unique = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
};

var spawnSchema = new mongoose.Schema({
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
    users: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
    pokemons: { type: [Number], default: [] }
});

spawnSchema.set('toObject', {
    virtuals: true
});
spawnSchema.set('toJSON', {
    virtuals: true
});

var SpawnDB = mongoose.model('Spawn', spawnSchema);

var getSpawn = function () {
    if (arguments.length === 1) {
        var callback = arguments[0];
        SpawnDB.find(function (err, spawns) {
            if (err) callback(err);
            else callback(err, spawns);
        });
    }
    else if (arguments.length === 2) {
        var user = arguments[0];
        var callback = arguments[1];
        SpawnDB.find({ users: user }, function (err, spawns) {
            if (err) callback(err);
            else callback(err, spawns);
        });
    }
};

var setSpawn = function (user, latitude, longitude, pokemon, callback) {
    SpawnDB.findOne({ latitude: latitude, longitude: longitude }, function (err, spawn) {
        if (!spawn) {

            var info = {
                users: [user],
                latitude: latitude,
                longitude: longitude
            };
            if (pokemon) info.pokemons = [pokemon];
            var spawn = new SpawnDB(info);
            spawn.save(function (err) {
                callback(err);
            });
        }
        else {

            var info = { users: spawn.users.concat(user).unique() };
            if (pokemon) info.pokemons = spawn.pokemons.concat(pokemon).unique();
            SpawnDB.update({
                latitude: latitude,
                longitude: longitude
            }, info, { multi: false },
                function (err, num) {
                    callback(err);
                }
            );
        }
    });
}

module.exports.get = getSpawn;
module.exports.set = setSpawn;