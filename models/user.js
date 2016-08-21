var mongodb = require('./mongodb');
var userSchema = new mongodb.mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    createAt: {type: Date, default: Date.now()},
    lastLogInAt: {type: Date, default: Date.now()}
});

userSchema.set('toObject', {
    virtuals: true
});
userSchema.set('toJSON', {
    virtuals: true
});

var UserDB = mongodb.mongoose.model('User', userSchema);

var saveUser = function (username, password, callback) {
    var newUser = new UserDB({'username': username,'password': password});
    newUser.save(
        function (err) {
            if (err) callback(err);
            else callback(null);
        }
    );
};

var removeUser = function (username, callback) {
    UserDB.remove({'username': username},callback);
}

var getUser = function (username, callback) {
    UserDB.findOne({ 'username': username },function (err, user) {
        if (err) callback(err);
        else {
            user.lastLogInAt=Date.now();
            user.save();
            callback(err, user);
        }
    });
}

module.exports.save = saveUser;
module.exports.get = getUser;
module.exports.remove = removeUser;