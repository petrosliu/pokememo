var mongoose = require('./mongodb');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../config.js');

var userSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
  hash: String,
  salt: String
});

userSchema.set('toObject', {
    virtuals: true
});
userSchema.set('toJSON', {
    virtuals: true
});

userSchema.methods.setPassword =function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password) {
    return this.hash === crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(expiry.getTime() / 1000),
    }, config.JWT_SECRET);
};

var UserDB = mongoose.model('User', userSchema);

var getUser = function(username,callback){
    UserDB.findOne({ username : username }, function (err, user){
        if(err) callback(err);
        else{
            callback(err,user);
        }
    });
};

var setUser = function(username, password, callback){
    var user = new UserDB({ username : username});
    user.setPassword(password);
    user.save(function(err){
        callback(err);
    });
};

var authUser = function(token, callback){
    jwt.verify(token, config.JWT_SECRET, function(err, data) {      
        if (err) return callback(err);    
        else return getUser(data.username, callback);
    });
}

module.exports.get = getUser;
module.exports.set = setUser;
module.exports.auth = authUser;