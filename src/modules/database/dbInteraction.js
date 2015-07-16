var mongoose = require('mongoose'), Schema = mongoose.Schema;
mongoose.connect('mongodb://braSean:qwerty1234@ds053312.mongolab.com:53312/storm');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("Connection to database was successful.");

});


//Loose schema
var mySchema = new Schema({name : String}, {strict:false});
var userSchema = new Schema({
    id : Number,
    name: String,
    password: String,
    projectID: [String],
    email: String
})

module.exports = {
//Get an array from collection colName

    getCollection: function(colName, callback)
{
    mySchema.set('collection', colName);
    col = mongoose.model(colName, mySchema);
    var data;

    col.find({},{'_id': 0},function (err, docs) {

        data = docs;
        callback(data);
    });

},
    insertDocument: function(colName, doc)
    {
        mySchema.set('collection', colName);
        col = mongoose.model(colName, mySchema);
        var insert = new col(JSON.parse(doc));

        insert.save(function (err) {
            if(err){console.log("Save failed");}
            else console.log("Saved!");
        });
    },
    removeDocument: function(colName, docId)
    {
        mySchema.set('collection', colName);
        col = mongoose.model(colName, mySchema);
        col.remove({id : docId}, function(err){
            if(err) console.log("Remove failed");
            else console.log("Removed!")
        });
    },
    checkLogin: function(username, password, callback)
    {
        userSchema.seet('collection', 'User');
        col = mongoose.model('User', userSchema);
        col.find({user: username, password: password},{'_id': 0},function (err, docs)
        {
            if(err) console.log(err);
            else
            callback(docs);
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








