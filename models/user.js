var mongoose = require('./mongodb');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../config.js');

var userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    hash: String,
    salt: String,
    player: {
        id: { type: String, default: '' },
        team: { type: String, default: '' },
        level: { type: Number, default: 1 }
    }
});

userSchema.virtual('name').get(function () {
    return this.player.id || this.username;
});

userSchema.set('toObject', {
    virtuals: true
});
userSchema.set('toJSON', {
    virtuals: true
});

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function (password) {
    return this.hash === crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.generateJwt = function () {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(expiry.getTime() / 1000),
    }, config.JWT_SECRET);
};

var UserDB = mongoose.model('User', userSchema);

var getUser = function (username, callback) {
    UserDB.findOne({ username: username }, function (err, user) {
        if (err) callback(err);
        if (user) callback(err, user);
        else {
            callback('User not found.');
        }
    });
};

var setUser = function (username, password, callback) {
    var user = new UserDB({ username: username });
    user.setPassword(password);
    user.save(function (err) {
        callback(err);
    });
};

var authUser = function (token, callback) {
    jwt.verify(token, config.JWT_SECRET, function (err, data) {
        if (err) return callback(err);
        else return getUser(data.username, callback);
    });
}

var updateUser = function (id, update, callback) {
    var password = update.password;
    delete update.password;
    UserDB.update({ _id: id }, update, { multi: false }, function (err, num) {
        if (err) callback(err);
        else {
            if (password) {
                UserDB.findOne({ _id: id }, function (err, user) {
                    if (err) callback(err);
                    else {
                        user.setPassword(password);
                        user.save(function (err) {
                            callback(err);
                        });
                    }
                });
            }
            else callback(err);
        }
    });
};

module.exports.get = getUser;
module.exports.set = setUser;
module.exports.auth = authUser;
module.exports.update = updateUser;