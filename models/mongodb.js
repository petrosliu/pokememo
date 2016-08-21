var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:admin@ds139985.mlab.com:39985/pokememo');
exports.mongoose = mongoose;