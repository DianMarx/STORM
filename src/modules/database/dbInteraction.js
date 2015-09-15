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
    username: String,
    password: String,
    projectID: [String],
    email: String
})

var projectSchema = new Schema({
    projectName: String,
    subjects: String,
    admin: Boolean
})
var idSchema = new Schema({id : Number}, {strict:false});



module.exports = {
//Get an array from collection colName

    addUser: function(data, callback)
    {
      //console.log(data);
        userSchema.set('collection', 'Users');
        col = mongoose.model("Users", userSchema);
        col.findOne({username: data.username}, function(err, ret)
        {

            if(ret == null)
            {
                col.findOne().sort('-id').exec( function(err, doc) {
                    var max = doc.id;
                    data.id = max +1;
                    var insert = new col(data);
                    insert.save(function (err) {
                        if(err){callback(1);}
                        else callback(2);
                    });

                });
            } else callback(0);

        });

    },


    getCollection: function(colName, callback)
    {
        idSchema.set('collection', colName);
        col = mongoose.model(colName, idSchema);
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
    insertSubjects: function(colName, doc)
    {
        mySchema.set('collection', colName);
        col = mongoose.model(colName, mySchema);
        var insert = new col(JSON.parse(doc));

        insert.save(function (err) {
            if(err){console.log("Save failed");}
            else console.log("Saved!");
        });
    },
    insertProject: function(doc,callback)
    {
        projectSchema.set('collection', "Projects");
        col = mongoose.model("Projects", projectSchema);
        data = JSON.parse(doc);
        col.findOne({subjects: data.subjects}, function(err, ret) // check if user has a project with the same name
        {
            if(ret == null)
            {
                    var insert = new col(JSON.parse(doc));
                    insert.save(function (err,docsInserted) {
                        if(err){callback(1);}
                        else callback(docsInserted);
                    });
            } else callback(0);

        });

    },
    deleteProject: function(subj,callback)
    {
        projectSchema.set('collection', 'Projects');
        col = mongoose.model('Projects', projectSchema);
        col.remove({subjects : subj}, function(err){
            if(err) {callback(1);}
            else {callback(0);}
        });
    },
    dropSubjects: function(subj,callback)
    {
        db.collection(subj).drop(function(err){
            if(err){callback(1);}
            else{callback(0);}
        })
    },
    removePIDfromUsers: function(uid,pid,callback)
    {
        userSchema.set('collection', 'Users');
        col = mongoose.model('Users', userSchema);

        col.update(
            {id:uid},
            {$pull: {projectID: {$in: [pid]}}},
            function(err){
                if(err){callback(1);}
                else {callback(0);}
            }
        )
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
    updateDocument: function(colName, id, updateInfo )
    {
        idSchema.set('collection', colName);
        col = mongoose.model(colName, idSchema);


        //stub

    },
    updateUser: function(id, projID)
    {
        userSchema.set('collection', 'Users');
        col = mongoose.model('Users', userSchema);


        col.findOne({id:id}, function(err,user)
        {
            if(err){return next(err)}
            user.projectID.push(projID);
            user.save(function(err){
                if(err) return next(err);
            });
        });

    },
    subjToDB: function(data, col)
    {
        idSchema.set('collection', col);
        coll = mongoose.model(col, idSchema);
        var id = 0;
        users = JSON.parse(data);
        users.forEach(function(user)
        {

            user.id = parseInt(user.id);
            newUser = new coll(user);
            newUser.save(function(err){
                if(err) return next(err);
            });
        });
    },

    checkLogin: function(username, password, callback)
    {
        userSchema.set('collection', 'Users');
        col = mongoose.model('Users', userSchema);
        col.find({username: username},{'_id': 0},function (err, docs)
        {
            if(err) console.log(err);
            else
                callback(docs);
        });
    },


    /*Get all project names where ids match the ids in array.
    used to populate projectSetup page if a user has one or more existing projects*/
    getProjects: function(ids,callback)
    {
        ids = JSON.parse(ids);
        projectSchema.set('collection', 'Projects');
        col = mongoose.model('Projects', projectSchema);

        col.find({_id: {$in : ids}},function (err, docs)
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









