var mongoose = require('mongoose');
var config = require('../config.js');
mongoose.Promise = global.Promise;
mongoose.connect(config.MONGO_DB);
module.exports = mongoose;