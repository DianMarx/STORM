var mongoose = require('mongoose');
mongoose.connect('mongodb://braSean:qwerty1234@ds053312.mongolab.com:53312/storm');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("Connection to database was successful.");
});