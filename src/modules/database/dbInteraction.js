var mongoose = require('mongoose'), Schema = mongoose.Schema;
mongoose.connect('mongodb://braSean:qwerty1234@ds053312.mongolab.com:53312/storm');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("Connection to database was successful.");

});


//Loose schema
var mySchema = new Schema({name : String}, {strict:false});

module.exports = {
//Get an array from collection colName

    getCollection: function(colName, callback)
{
    mySchema.set('collection', colName);
    col = mongoose.model(colName, mySchema);
    var data;

    col.find(function (err, docs) {
        data = docs;
        callback(data);
    });

}
}
//how to call
/**
getCollection('testCol', function(data){
    console.log(data);
    //here you use 'data'. just replace console.log(data) with implementation
});
 **/







