

// Dummy users

var db = require('../modules/database/dbInteraction');


module.exports=function(app) {
    app.get('/', function (req, res) {

        res.render('index.html');
        //here you use 'data'. just replace console.log(data) with implementation


    });
    app.get('/about', function (req, res) {

        res.render('aboutUs.html');


    });
    app.get('/contact', function (req, res) {

        res.render('contactUs.html');


    });
    app.get('/demo', function (req, res) {
        db.getCollection('testCol', function (data) {
            res.render('teamSetup', {subjects: data});
        });
    });

    app.get('/teamSetup', function (req, res) {

        if (req.query.collection === undefined) return;
        var collection = req.query.collection;

        db.getCollection(collection, function (data) {
            res.render('teamSetup', {subjects: data});
        });
    });
        app.get('/test', function (req, res) {
            db.getCollection('testCol', function (data) {
                res.render('test', {subjects: data});
            });
            //var val = req.query.name;
            //console.log(req);

        });

    app.post('/insert', function (req, res) {

        db.insertDocument(req.body.collection, req.body.data)


    });

    app.post('/update', function (req, res) {


        db.updateDocument(req.body.collection, req.body.id, req.body.data)
        //console.log("yolo");

    });

    app.post('/projToUser', function (req, res) {

        //console.log(req.body.id + " "+req.body.projectID );
        db.updateUser(req.body.id, req.body.projectID)
        //console.log("yolo");
        res.send("");
    });

    app.post('/subjToDB', function (req, res) {

        console.log(req.body.data);
        db.subjToDB(req.body.data, req.body.collection);
        //console.log("yolo");
        res.send("");
    });

    app.post('/login', function (req, res) {

        db.checkLogin(req.body.username, req.body.password, function(data)
        {
            res.send(data);
        });


    });
    app.post('/signUp', function (req, res) {



        db.addUser(req.body, function(code)
        { //0 Username exists
            //1 failure
            //2 success
           res.send({code: code,user: req.body});
        });


    });

    app.get('/projectHome', function (req, res) {

        res.render('projectSetup.html');

    });

    app.post('/projectSetup', function (req, res) {

        db.getProjects(req.body.ids, function(data)
        {
            res.send(data);
        });

    });

    app.post('/subjectsStore', function (req, res)
    {
        var subjects = req.body.subjects;
        subjects = JSON.parse(subjects);
        var SubjectsName =  req.body.subjectsName;

        /*Insert Subject Data*/


    });
    app.post('/projectStore', function (req, res)
    {

        var projData = JSON.stringify(req.body);
        db.insertProject(projData,function(newProjectID)
        {
            var newID = newProjectID._id;
            res.send(newID);
        });

        /*Insert Subject Data*/


    });

}