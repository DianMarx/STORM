var mongoose = require('mongoose'), Schema = mongoose.Schema;
mongoose.connect('mongodb://braSean:qwerty1234@ds053312.mongolab.com:53312/storm');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("Connection to database was successful.");

});


//Loose schema
var mySchema = new Schema({name : String}, {strict:false});

function collectionToArray(colName)
{

    var data;
    mySchema.set('collection', colName);
    col = mongoose.model(colName,mySchema);
    col.find(function (err, docs) {
        data = docs;

    });
    return data;

}
arr = collectionToArray('testCol');
console.log(arr);




